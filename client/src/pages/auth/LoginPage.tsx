import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff,Loader } from 'lucide-react';
import {FcGoogle} from "react-icons/fc";
import {FaGithub} from "react-icons/fa";
import { useAuthStore } from '../../context/store/authStore';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const backendUrl = "http://localhost:8081/api/v1";
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login,sendVerifyOtp, error, isLoading, message } = useAuthStore();
  const navigate = useNavigate();

  /*const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    const mockUser = {
      id: 'user123',
      name: 'John Doe',
      email: formData.email,
      avatar: `https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400`,
      userType: 'client' as const,
      rating: 4.8,
      completedOrders: 15
    };
    setUser(mockUser);
    navigate('/');
  };*/

  const handleSignUp = async (e: React.FormEvent) => {
  
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    
    try {
      const userData = await login(email, password);
      console.log('User data in handleSignUp:', userData);

      if (!userData.accountVerified) {
        // If not verified, send OTP and navigate to verification page
        await sendVerifyOtp();
        toast.success("Please verify your email. OTP sent to your email address.");
        navigate("/verify-email"); // Navigate to your email verification page
      } else {
      
      
        // If verified, navigate to the home page or dashboard
        navigate("/");
        toast.success("Login successful!");
      
    }
      
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your credentials.");
    }

    
	};

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loginWithGoogle = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  const loginWithGithub = () => {
    window.location.href = `${backendUrl}/oauth2/authorization/github`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        
        <h2 className="mt-2 text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
            Sign up for free
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
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
                  autoComplete="current-password"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
                  Forgot your password?
                </Link>
              </div>
              {error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}
              {message && <p className='text-green-500 font-semibold mb-2'>{message}</p>}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button onClick={loginWithGoogle} className="w-full inline-flex justify-center py-2 px-4 gap-1 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
               <FcGoogle className='w-5 h-5'/> 
                  Google
              </button>
              <button onClick={loginWithGithub} className="w-full inline-flex justify-center py-2 px-4 gap-1 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
               <FaGithub className='w-5 h-5'/> 
                  Github
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;