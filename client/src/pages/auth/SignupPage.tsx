import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Users, Briefcase, Loader } from "lucide-react";
import { useAuthStore } from "../../context/store/authStore";
import toast from "react-hot-toast";

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"client" | "expert">("client");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const { register, error, isLoading, message } = useAuthStore();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirmPassword, firstName, lastName } = formData;
    const name = `${firstName} ${lastName}`;
    const role = userType === "expert" ? "PROVIDER" : "CLIENT";

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await register(email, password, name, role);
      toast.success("Registration successful! Please verify your email.");
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with background image + curve */}
      <div
        className="hidden lg:flex w-1/2 relative bg-cover bg-center"
        style={{
  backgroundImage:
    "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=compress&cs=tinysrgb&w=1600')",
}}
      >
        <div className="flex items-center justify-center w-full bg-black bg-opacity-50">
          <h1 className="text-white text-4xl font-bold text-center px-6">
            
          </h1>
        </div>
        {/* SVG curve */}
        <svg
          className="absolute top-0 right-0 h-full w-48 text-white"
          viewBox="0 0 150 100"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C90,60 60,60 150,100 L150,0 Z" fill="white" />
        </svg>
      </div>

      {/* Right side with form */}
      <div className="flex flex-col justify-center w-full lg:w-1/2 px-8 sm:px-12 md:px-16 lg:px-20 bg-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Join CreatorBoost
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-1 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white shadow-2xl rounded-xl p-8">
            {/* Error/Message */}
            {error && (
              <p className="text-red-500 font-semibold text-sm">{error}</p>
            )}
            {message && (
              <p className="text-green-500 font-semibold text-sm">{message}</p>
            )}

            {/* User Type */}
            <div className="mb-6">
              <label className="text-base font-medium text-gray-900">
                I want to:
              </label>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input
                    id="client"
                    name="userType"
                    type="radio"
                    checked={userType === "client"}
                    onChange={() => setUserType("client")}
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300"
                  />
                  <label
                    htmlFor="client"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-emerald-500 mr-2" />
                      Hire experts to grow my social media
                    </div>
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="expert"
                    name="userType"
                    type="radio"
                    checked={userType === "expert"}
                    onChange={() => setUserType("expert")}
                    className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300"
                  />
                  <label
                    htmlFor="expert"
                    className="ml-3 block text-sm font-medium text-gray-700"
                  >
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-emerald-500 mr-2" />
                      Offer my expertise and earn money
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                  />
                </div>
              </div>

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
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
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
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border rounded-md shadow-sm pr-10 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 border-gray-300"
                />
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-900">
                  I agree to the{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-emerald-600 hover:text-emerald-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 rounded-md text-white font-medium ${
                  isLoading
                    ? "bg-emerald-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              >
                {isLoading ? <Loader className="w-6 h-6 animate-spin" /> : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
