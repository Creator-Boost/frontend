import React, { useState } from "react";
import { Loader, Lock, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminAuthStore } from "../context/useAdminAuthStore";

const AdminLogin: React.FC = () => {
  const { login, isLoading, error } = useAdminAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);

      const user = useAdminAuthStore.getState().user;
      const isAuthenticated = useAdminAuthStore.getState().isAuthenticated;

      if (isAuthenticated && user?.role === "ADMIN") {
        toast.success("Welcome Admin!");
        window.location.href = "/";
      } else if (!isAuthenticated) {
        toast.error("Invalid credentials or not an admin account.");
      }
    } catch (err) {
      toast.error("An error occurred during login.");
      console.error(err);
    }
  };

  return (
    // Background: Subtle light blue gradient for a professional feel
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50"> 
      
      {/* Floating Card: Highly rounded, soft shadow, professional white */}
      <div className="bg-white shadow-3xl rounded-[30px] p-10 w-full max-w-sm transition duration-500 hover:shadow-4xl">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* Icon: Blue/Cyan gradient ring */}
          <div className="w-16 h-16 mx-auto mb-4 p-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 shadow-lg">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Secure Admin Login
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Access your management dashboard.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Pill shape with focus ring matching the blue theme
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner transition duration-200"
              placeholder="Email address"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Pill shape with focus ring matching the blue theme
              className="w-full bg-gray-50 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-full py-3 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-inner transition duration-200"
              placeholder="Password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            // Button: Strong blue-to-cyan gradient
            className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-cyan-700 text-white py-3 rounded-full font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition duration-300 shadow-xl shadow-blue-300/50 disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin w-5 h-5 mr-3" />
                
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;