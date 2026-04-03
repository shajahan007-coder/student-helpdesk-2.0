import React from 'react';
import './StatsCards.css';

function StatsCards({ tickets }) {
  // Calculate stats logic
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'Open').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <div className="stats-container">
      <div className="card total">
        <h3>Total Tickets</h3>
        <p className="stat-number">{total}</p>
      </div>
      <div className="card pending">
        <h3>Pending</h3>
        <p className="stat-number">{pending}</p>
      </div>
      <div className="card resolved">
        <h3>Resolved</h3>
        <p className="stat-number">{resolved}</p>
      </div>
    </div>
  );
}

export default StatsCards;