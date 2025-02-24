import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Redirect to login if no token exists
    return <Navigate to="/" />;
  }

  // If token exists, show the protected component
  return <>{children}</>;
}

export default ProtectedRoute; 