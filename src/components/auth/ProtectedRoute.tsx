import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { currentUser, userData, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kavach-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!currentUser) {
    return <Navigate to="/auth/login" />;
  }

  // If role restrictions are specified, check if user has permission
  if (allowedRoles && userData && !allowedRoles.includes(userData.role)) {
    // Redirect based on user's actual role
    if (userData.role === 'user') {
      return <Navigate to="/u/dashboard" />;
    } else if (userData.role === 'admin') {
      return <Navigate to="/a/dashboard" />;
    } else if (userData.role === 'superadmin') {
      return <Navigate to="/sa/dashboard" />;
    }
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
