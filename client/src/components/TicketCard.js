import React from 'react';
import './TicketCard.css'; // CRITICAL: This links the CSS to this file

function TicketCard({ ticket, onResolve, onDelete }) {
  // Logic: If ticket is resolved, use "card resolved". If not, just "card".
  const cardClassName = ticket.status === "Resolved" ? "card resolved" : "card";

  return (
    <div className={cardClassName}>
      <h3>{ticket.subject}</h3>
      <p>Status: <span className="status-label">{ticket.status}</span></p>
      
      <div className="actions">
        {ticket.status !== "Resolved" && (
          <button onClick={() => onResolve(ticket._id)} className="resolve-btn">
            Mark as Resolved
          </button>
        )}
        <button onClick={() => onDelete(ticket._id)} className="delete-btn">
          Delete Ticket
        </button>
      </div>
    </div>
  );
}

export default TicketCard;