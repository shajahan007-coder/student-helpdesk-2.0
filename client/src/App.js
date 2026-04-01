import React, { useState, useEffect } from 'react';
import TicketCard from './components/TicketCard';
import './App.css';

function App() {
  const [subject, setSubject] = useState("");
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setBy] = useState("newest");

  // --- 1. SET YOUR RENDER URL HERE ---
  // Make sure this matches the link Render gave you!
  const API_URL = "https://your-backend-name.onrender.com";

  const fetchTickets = () => {
    fetch(`${API_URL}/all-tickets`)
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error("Fetch error:", err));
  };

  useEffect(() => { fetchTickets(); }, []);

  // --- 2. Action Handlers (Fixed Syntax) ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!subject) return;

    // Fixed: The parentheses now wrap both the URL and the options object
    fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject })
    }).then(() => {
      setSubject("");
      fetchTickets();
    });
  };

  const resolveTicket = (id) => {
    // Fixed: Parentheses were closing after the URL, now they close after the object
    fetch(`${API_URL}/tickets/${id}`, { 
      method: 'PUT' 
    })
    .then(() => fetchTickets());
  };

  const deleteTicket = (id) => {
    // Fixed: Updated from localhost to API_URL
    fetch(`${API_URL}/tickets/${id}`, { 
      method: 'DELETE' 
    })
    .then(() => fetchTickets());
  };

  // --- 3. Data Logic ---
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
        <input 
          className="search-input"
          placeholder="🔍 Search tickets..." 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />

        <select className="sort-select" onChange={(e) => setBy(e.target.value)}>
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="ticket-form">
        <input 
          className="ticket-input"
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="New Issue..." 
        />
        <button type="submit" className="submit-btn">Submit</button>
      </form>

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