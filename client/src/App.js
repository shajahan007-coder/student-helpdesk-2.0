import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // This state will hold { email: "...", role: "admin/student" }
  const [user, setUser] = useState(null); 

  useEffect(() => {
  const loggedInUser = localStorage.getItem('user');
  if (loggedInUser) {
    const foundUser = JSON.parse(loggedInUser);
    setUser(foundUser);
  }
}, []);

// This automatically picks the right URL based on where the app is running
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />

        {/* PROTECTED: Only logged-in Students or Admins */}
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <StudentDashboard user={user} />
          </ProtectedRoute>
        } />

        {/* PROTECTED: ONLY Admins can see this */}
        <Route path="/admin" element={
          <ProtectedRoute user={user} adminOnly={true}>
            <AdminPanel user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  
}

export default App;