import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const {
    user,
    isHydrated,
    openModal,
    setIntendedRoute
  } = useAuthStore();

  const location = useLocation();

  // Wait for Zustand hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-primary-blue/30 border-t-primary-blue rounded-full animate-spin"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    setTimeout(() => {
      setIntendedRoute(location.pathname);
      openModal('login');
    }, 0);

    return <Navigate to="/" replace />;
  }

  // Role check
  if (
    allowedRoles &&
    !allowedRoles
      .map(role => role.toLowerCase())
      .includes(user.role?.toLowerCase())
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;