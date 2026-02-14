import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If set, only this role can access the route */
  allowedRole?: 'student' | 'lecturer';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Wrong role → send them to their own dashboard
    const dest = user.role === 'lecturer' ? '/lecturer' : '/student';
    return <Navigate to={dest} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
