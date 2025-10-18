import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import TopNavbar from './components/Layout/TopNavbar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Services from './pages/Services';
import Bookings from './pages/Bookings';
import Reports from './pages/Reports';
import Disputes from './pages/Disputes';
import Settings from './pages/Settings';
import ProviderVerificationRequests from './pages/ProviderVerificationRequests';
import { Routes, Route } from "react-router-dom";
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';


function AdminApp() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'provider-requests':
        return <ProviderVerificationRequests />;
      case 'users':
        return <Users />;
      case 'services':
        return <Services />;
      case 'bookings':
        return <Bookings />;
      case 'reports':
        return <Reports />;
      case 'disputes':
        return <Disputes />;
      case 'settings':
        return <Settings />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col">
        <TopNavbar
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          setCurrentPage={setCurrentPage}
        />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminApp />
            </ProtectedRoute>
          }
        />
      </Routes>
    
  );
}