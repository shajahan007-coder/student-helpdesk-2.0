import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null); // Clear user state
    localStorage.removeItem('user'); // Clear saved session
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <Link to="/">🎓 Helpdesk Pro</Link>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        {/* If NO user is logged in */}
        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup" className="nav-btn">Join Now</Link></li>
          </>
        )}

        {/* If a STUDENT is logged in */}
        {user?.role === 'student' && (
          <>
            <li><Link to="/dashboard">My Tickets</Link></li>
            <li className="user-email">{user.email}</li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        )}

        {/* If an ADMIN is logged in */}
        {user?.role === 'admin' && (
          <>
            <li><Link to="/admin">Admin Panel</Link></li>
            <li className="admin-badge">Admin</li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;