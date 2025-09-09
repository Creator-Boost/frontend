import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useAuthStore } from "../../context/store/authStore";
import toast from "react-hot-toast";

const LoginPage: React.FC = () => {
  const backendUrl = "http://localhost:8081/api/v1";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, sendVerifyOtp, error, isLoading, message } = useAuthStore();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      const userData = await login(email, password);
      if (!userData.accountVerified) {
        await sendVerifyOtp();
        toast.success("Please verify your email. OTP sent to your email.");
        navigate("/verify-email");
      } else {
        navigate("/");
        toast.success("Login successful!");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loginWithGoogle = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/github`;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with background image + curve */}
      <div
        className="hidden lg:flex w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=compress&cs=tinysrgb&w=1600')",
        }}
      >
        <div className="flex items-center justify-center w-full bg-black bg-opacity-50">
          <h1 className="text-white text-4xl font-bold text-center px-6">
           
          </h1>
        </div>
        {/* SVG curve */}
        <svg
          className="absolute top-0 right-0 h-full w-48 text-white" // increased width for a bigger curve
          viewBox="0 0 150 100" // wider viewBox for more curve
          preserveAspectRatio="none"
        >
          <path d="M0,0 C90,60 60,60 150,100 L150,0 Z" fill="white" />
        </svg>
      </div>

      {/* Right side with form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-12 md:px-16 lg:px-20 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white shadow-2xl rounded-xl p-8">
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border-gray-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-900">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Forgot password?
                </Link>
              </div>
              {error && (
                <p className="text-red-500 font-semibold text-sm">{error}</p>
              )}
              {message && (
                <p className="text-green-500 font-semibold text-sm">
                  {message}
                </p>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 rounded-md text-white font-medium bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {isLoading ? (
                  <Loader className="w-6 h-6 animate-spin" />
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={loginWithGoogle}
                className="flex items-center justify-center gap-2 py-2 px-4 border rounded-md bg-white text-sm font-medium text-gray-600 shadow hover:bg-gray-50"
              >
                <FcGoogle className="w-5 h-5" /> Google
              </button>
              <button
                onClick={loginWithGithub}
                className="flex items-center justify-center gap-2 py-2 px-4 border rounded-md bg-white text-sm font-medium text-gray-600 shadow hover:bg-gray-50"
              >
                <FaGithub className="w-5 h-5" /> GitHub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
