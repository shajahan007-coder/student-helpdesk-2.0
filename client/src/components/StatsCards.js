import React from 'react';
import './StatsCards.css';
import { Link, useNavigate } from 'react-router-dom';

function StatsCards({ tickets = [] }) { // Add = [] here as a fallback
  // OR use optional chaining
  const total = tickets?.length || 0;
  const pending = tickets?.filter(t => t.status === 'Open').length || 0;
  const resolved = tickets?.filter(t => t.status === 'Resolved').length || 0;
  
  // ... rest of your return code
}

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