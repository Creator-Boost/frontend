import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../context/store/authStore";

interface RedirectAuthenticatedUserProps {
  children: React.ReactNode;
}

const RedirectAuthenticatedUser: React.FC<RedirectAuthenticatedUserProps> = ({ children }) => {
  const { isAuthenticated, isVerified } = useAuthStore();

  // Redirect if authenticated and verified
  if (isAuthenticated && isVerified) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RedirectAuthenticatedUser;
