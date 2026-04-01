import React, { useState, useEffect } from 'react';
import TicketCard from './components/TicketCard';
import './App.css';

function App() {
  const [subject, setSubject] = useState("");
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setBy] = useState("newest"); // Default to lowercase "newest"

  // 1. Fetch data from Cloud
  const fetchTickets = () => {
    fetch('http://localhost:5000/all-tickets')
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.log(err));
  };

  useEffect(() => { fetchTickets(); }, []);

  // 2. Action Handlers (Create, Resolve, Delete)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject) return;
    fetch('http://localhost:5000/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject })
    }).then(() => {
      setSubject("");
      fetchTickets();
    });
  };

  const resolveTicket = (id) => {
    fetch(`http://localhost:5000/tickets/${id}`, { method: 'PUT' })
      .then(() => fetchTickets());
  };

  const deleteTicket = (id) => {
    fetch(`http://localhost:5000/tickets/${id}`, { method: 'DELETE' })
      .then(() => fetchTickets());
  };

  // 3. DATA LOGIC: Filter first, then Sort the filtered results
  const filteredTickets = tickets.filter(t => 
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === "newest") return b._id.localeCompare(a._id);
    return a._id.localeCompare(b._id);
  });

  return (
    <div className="dashboard">
      <h1>Student Helpdesk 2.0</h1>
      
      <div className="controls">
        {/* Search Bar */}
        <input 
          className="search-input"
          placeholder="🔍 Search tickets..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        {/* Sort Dropdown */}
        <select className="sort-select" onChange={(e) => setBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Ticket Creation Form */}
      <form onSubmit={handleSubmit} className="ticket-form">
        <input 
          className="ticket-input"
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="New Issue..." 
        />
        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {/* Grid Displaying the Sorted and Filtered Results */}
      <div className="ticket-grid">
        {sortedTickets.map(t => (
          <TicketCard 
            key={t._id} 
            ticket={t} 
            onResolve={resolveTicket} 
            onDelete={deleteTicket} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;