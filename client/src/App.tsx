import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ServicesPage from './pages/ServicesPage';
import ExpertDashboard from './pages/ExpertDashboard';
import ClientDashboard from './pages/ClientDashboard';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/MessagesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/service/:id" element={<ServiceDetailPage />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;