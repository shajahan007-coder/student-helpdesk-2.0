import { useState, useEffect } from 'react'; // 1. Added useEffect here
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home'; // 2. Make sure these are imported
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AdminPanel from './pages/AdminPanel';
import Signup from './pages/Signup'; // Don't forget to import Signup

function App() {
  const [user, setUser] = useState(null); 

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
    }
  }, []);

  
  // 3. You MUST have a return () statement around your HTML/JSX
  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} /> {/* 4. Added route for Signup */}

        <Route path="/dashboard" element={
          <ProtectedRoute user={user}>
            <StudentDashboard user={user} />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute user={user} adminOnly={true}>
            <AdminPanel user={user} />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;