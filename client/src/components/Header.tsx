"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MessageCircle } from "lucide-react";
import { useAuthStore } from "../context/store/authStore";
import {
  Navbar,
  NavBody,
 
  MobileNav,
 
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./ui/resizable-navbar";

const Header: React.FC = () => {
  const { user, isAuthenticated,logout } = useAuthStore();
  console.log("user", user);
  console.log("isAuthenticated", isAuthenticated);
  
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  

  return (
    <div className="sticky top-0 z-50 w-full  shadow-sm ">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center mr-4"
          >
            <span className="text-black text-2xl tracking-wide font-bold">
              Creator
            </span>
            <span className="text-emerald-500 text-2xl font-bold">Boost</span>
          </button>

          

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 mx-4 min-w-[250px] max-w-lg">
  <div className="relative w-full">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder="Search for social media services..."
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-[150px]"
    />
  </div>
</div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Services
                </Link>

                <Link
                  to="/messages"
                  className="text-gray-700 hover:text-emerald-600 p-2 rounded-md"
                >
                  <MessageCircle className="h-5 w-5" />
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-emerald-600 p-2 rounded-md">
                    <img
                      src={user?.imageUrl || "https://via.placeholder.com/150"}
                      alt={user?.name || "User Avatar"}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="hidden md:block">{user?.name}</span>
                  </button>

                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to={user?.role === "PROVIDER" ? "/expert-dashboard" : "/client-dashboard"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to={`/profile/${user?.userId}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Browse Services
                </Link>
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center mr-4"
          >
            <span className="text-black text-2xl tracking-wide font-bold">
              Creator
            </span>
            <span className="text-emerald-500 text-2xl font-bold">Boost</span>
          </button>
            
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            

            {isAuthenticated ? (
              <div className="flex flex-col self-end gap-2 mt-4">
                <Link
                  to={user?.role === "PROVIDER" ? "/expert-dashboard" : "/client-dashboard"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Dashboard
                </Link>
                <Link
                  to={`/profile/${user?.userId}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col self-end gap-2 mt-4 ">
                <NavbarButton
                  variant="secondary"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  Login
                </NavbarButton>
                <NavbarButton
                  variant="primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full"
                >
                  Join Now
                </NavbarButton>
              </div>
            )}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default Header;
