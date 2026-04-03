import React from 'react'; // Added for build safety
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-hero">
      <div className="hero-content">
        <h1>Fast. Simple. <span className="blue-text">Solved.</span></h1>
        <p>The modern helpdesk for the modern student. Submit your issues and track them in real-time.</p>
        <div className="hero-btns">
          <button onClick={() => navigate('/signup')} className="primary-btn">Get Started</button>
          <button onClick={() => navigate('/login')} className="secondary-btn">Check Status</button>
        </div>
      </div>
      <div className="hero-image">
         {/* Pro Tip: Replace this with a real illustration from Undraw or Lucide-React later */}
         <img 
           src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&q=80&w=500" 
           alt="Helpdesk Illustration" 
         />
      </div>
    </div>
  );
}

export default Home;