import React, { useState } from 'react';
import StatsCards from '../components/StatsCards';
import TicketCard from '../components/TicketCard';
import './AdminPanel.css';

function AdminPanel({ tickets, onResolve, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Logic: Filter tickets based on email OR subject
  const filteredTickets = tickets.filter(t => 
    t.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2>Admin Control Center</h2>
        <div className="search-bar-container">
          <input 
            type="text" 
            placeholder="Search by student email or issue..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
      </header>
      
      <StatsCards tickets={tickets} />

      <div className="admin-list">
        <div className="list-header">
          <h3>Showing {filteredTickets.length} Results</h3>
        </div>

        {filteredTickets.length === 0 ? (
          <p className="no-results">No tickets match your search.</p>
        ) : (
          filteredTickets.map(t => (
            <TicketCard 
              key={t._id} 
              ticket={t} 
              onResolve={onResolve} 
              onDelete={onDelete} 
            />
          ))
        )}
      </div>
    </div>
  );
}

export default AdminPanel;