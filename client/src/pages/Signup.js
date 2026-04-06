import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student"); // Default to Capitalized
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL || "https://student-helpdesk-2-0-backend.onrender.com";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), // Clean the email
          password, 
          role 
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account created! Please login.");
        navigate('/login');
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server is waking up... please try again in 30 seconds.");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSignup}>
        <h2>Create Account</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <input 
          type="email" 
          placeholder="College Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Create Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <div className="role-selector">
          <label>I am a:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Student">Student</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>

        <button type="submit" className="login-btn">Register</button>
        <p className="switch-text">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;