import React from 'react';
import './StatsCards.css';

function StatsCards({ tickets = [] }) { 
  // 1. Logic (Inside the function)
  const total = tickets?.length || 0;
  const pending = tickets?.filter(t => t.status === 'Open').length || 0;
  const resolved = tickets?.filter(t => t.status === 'Resolved').length || 0;
  
  // 2. Return (Inside the function)
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
} // <--- THIS is the only closing brace that should be here!

export default StatsCards;