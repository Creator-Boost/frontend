import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAdminAuthStore } from "../context/useAdminAuthStore";

import type { ReactNode } from "react";
import { Loader } from "lucide-react";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, checkAuth } = useAdminAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verify = async () => {
      await checkAuth();
      setIsChecking(false);
    };
    verify();
  }, [checkAuth]);

  // While checking authentication → show loading screen or blank
  if (isChecking) {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <Loader className="w-10 h-10 text-indigo-600 animate-spin mb-3" />
      
    </div>
  );
}

  // Now decide access after checkAuth is done
  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
