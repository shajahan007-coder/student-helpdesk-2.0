import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children, adminOnly = false }) {
  // 1. If not logged in at all, kick them to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. If it's an admin-only page and the user is a student, kick them to Home
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // 3. Otherwise, let them in!
  return children;
}

export default ProtectedRoute;