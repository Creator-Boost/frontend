import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../context/store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean; // optional, default true
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireVerified = true }) => {
  const { isAuthenticated, isVerified } = useAuthStore();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If email verification is required but user is not verified
  if (requireVerified && !isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
