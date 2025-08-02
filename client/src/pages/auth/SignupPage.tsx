import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff,  Users, Briefcase } from 'lucide-react';
import { useAuthStore } from '../../context/store/authStore';
import toast from 'react-hot-toast';


const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'client' | 'expert'>('client');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const navigate = useNavigate();
  const { register, error, isLoading, message } = useAuthStore();
  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup
    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400`,
      userType,
      rating: 0,
      completedOrders: 0
    };
    setUser(newUser);
    navigate(userType === 'expert' ? '/expert-dashboard' : '/client-dashboard');
  };*/
  const handleSignUp = async (e: React.FormEvent) => {
  
    e.preventDefault();
    const { email, password, confirmPassword, firstName, lastName } = formData;
    const name = `${firstName} ${lastName}`;
    const role = userType === 'expert' ? 'PROVIDER' : 'CLIENT';

    if (password !== confirmPassword) {
		console.log("Passwords do not match");
    toast.error("Passwords do not match");
		return;
	}

		try {
			await register(email, password, name, role);
      toast.success("Registration successful! Please verify your email.");
      
			navigate("/login");
		} catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
      
		}
	};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
          Join SocialBoost
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign in
          </Link>
        </p>
      </div>


      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">


          {/* Display error message if any */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {/* Display success message if any */}
          {message && (
            <div className="mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
              {message}
            </div>
          )}

          {/* User Type Selection */}
          <div className="mb-6">
            <label className="text-base font-medium text-gray-900">I want to:</label>
            <div className="mt-4 space-y-4">
              <div className="flex items-center">
                <input
                  id="client"
                  name="userType"
                  type="radio"
                  checked={userType === 'client'}
                  onChange={() => setUserType('client')}
                  className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300"
                />
                <label htmlFor="client" className="ml-3 block text-sm font-medium text-gray-700">
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
                  checked={userType === 'expert'}
                  onChange={() => setUserType('expert')}
                  className="focus:ring-emerald-500 h-4 w-4 text-emerald-600 border-gray-300"
                />
                <label htmlFor="expert" className="ml-3 block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-emerald-500 mr-2" />
                    Offer my expertise and earn money
                  </div>
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-emerald-600 hover:text-emerald-500">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? "bg-emerald-300 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500`}
              >
                {isLoading ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;