import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 // This is the correct, dynamic way to handle your API URL
const API_URL = process.env.REACT_APP_API_URL || "https://student-helpdesk-2-0-backend.onrender.com";

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // 1. Save user info to App.js state
        setUser({ email: data.email, role: data.role, token: data.token });
        
        // 2. Save to LocalStorage so they stay logged in if they refresh
        localStorage.setItem('user', JSON.stringify(data));

        // 3. Redirect based on role
        if (data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server is sleeping. Try again in 30 seconds!");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Welcome Back</h2>
        {error && <p className="error-msg">{error}</p>}
        
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <button type="submit" className="login-btn">Login</button>
        <p className="switch-text">
          New here? <span onClick={() => navigate('/signup')}>Create Account</span>
        </p>
      </form>
    </div>
  );
}

export default Login;