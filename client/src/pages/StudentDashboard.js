import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';

function StudentDashboard({ user }) {
  const [subject, setSubject] = useState("");
  const [myTickets, setMyTickets] = useState([]);
 // Replace the hardcoded line with this:
const API_URL = process.env.REACT_APP_API_URL || "https://student-helpdesk-2-0-backend.onrender.com";

 const fetchMyTickets = async () => {
  // Use the new dynamic route we just made
  const res = await fetch(`${API_URL}/my-tickets/${user.email}`);
  const data = await res.json();
  setMyTickets(data);
};

 useEffect(() => {
  fetchMyTickets();
}, [user.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject) return;

    await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, studentEmail: user.email })
    });
    setSubject("");
    fetchMyTickets();
  };

  return (
    <div className="inbox-container">
      <header className="inbox-header">
        <h2>Welcome back, <span className="user-highlight">{user.email.split('@')[0]}</span></h2>
        <p>You have {myTickets.filter(t => t.status === 'Open').length} active issues.</p>
      </header>

      {/* Ticket Creation Area */}
      <section className="create-ticket-section">
        <form onSubmit={handleSubmit} className="compact-form">
          <input 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)} 
            placeholder="Describe your issue (e.g. WiFi not working in Room 302)" 
          />
          <button type="submit">Submit Ticket</button>
        </form>
      </section>

      {/* The Inbox List */}
      <section className="ticket-inbox">
        <h3>My Request History</h3>
        {myTickets.length === 0 ? (
          <div className="empty-state">
            <p>No tickets yet. If you have an issue, submit it above!</p>
          </div>
        ) : (
          <div className="inbox-list">
            {myTickets.map(t => (
              <div key={t._id} className="inbox-item">
                <div className="ticket-info">
                  <span className="ticket-id">#{t._id.slice(-5).toUpperCase()}</span>
                  <p className="ticket-subject">{t.subject}</p>
                </div>
                <div className="ticket-meta">
                  <span className={`status-badge ${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudentDashboard;