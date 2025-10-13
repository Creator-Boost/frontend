import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from "react-hot-toast";
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ServicesPage from './pages/ServicesPage';
import ExpertDashboard from './pages/dashboard/ExpertDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import ProfilePage from './pages/ProfilePage';
import MessagesPage from './pages/chat/MessagesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import { UserProvider } from './context/UserContext';
import EmailVerificationPage from './pages/auth/EmailVerificationPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import ProviderRequestVerification from './pages/ProviderRequestVerification';

import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentFailurePage from './pages/payment/PaymentFailurePage';

import { useAuthStore } from './context/store/authStore';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingPage';
import UsersList from './pages/users';
import { useChatStore } from './context/store/chatStore';
import Chatbot from './components/Chatbot';
import RedirectAuthenticatedUser from './components/auth/RedirectAuthenticatedUser';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Wrapper to handle conditional header + chatbot
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const hideHeaderAndChat = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password/:token",
    "/verify-email",
    "/payment/success",
    "/payment/failure",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideHeaderAndChat && <Header />}
      {children}
      {!hideHeaderAndChat && <Chatbot />}
    </div>
  );
}

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const [isAnimationDone, setIsAnimationDone] = useState(false);
  const { disconnect } = useChatStore();

  useEffect(() => {
    checkAuth();
    const timer = setTimeout(() => setIsAnimationDone(true), 1200);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  // Cleanup chat connection on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  if (isCheckingAuth || !isAnimationDone) return <LoadingScreen />;

  return (
    <UserProvider>
      <Router>
        <Layout>
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />


            {/* Auth Pages (redirect if already logged in) */}
            <Route
              path="/login"
              element={
                <RedirectAuthenticatedUser>
                  <LoginPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/signup"
              element={
                <RedirectAuthenticatedUser>
                  <SignupPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <RedirectAuthenticatedUser>
                  <ForgotPasswordPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <RedirectAuthenticatedUser>
                  <ResetPasswordPage />
                </RedirectAuthenticatedUser>
              }
            />
            <Route
              path="/verify-email"
              element={
                <RedirectAuthenticatedUser>
                  <EmailVerificationPage />
                </RedirectAuthenticatedUser>
              }
            />

            {/* Provider verification request page */}
            <Route
              path="/provider/request-verification"
              element={
                <ProtectedRoute>
                  <ProviderRequestVerification />
                </ProtectedRoute>
              }
            />

            {/* Protected Pages (require login) */}
            <Route
              path="/expert-dashboard"
              element={
                <ProtectedRoute>
                  <ExpertDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-dashboard"
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/service/:id"
              element={
                <ProtectedRoute>
                  <ServiceDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersList />
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<HomePage />} />

            <Route path="/payment/success" element={<PaymentSuccessPage />} />
            <Route path="/payment/failure" element={<PaymentFailurePage />} />

          </Routes>
          <Toaster />
        </Layout>
      </Router>
    </UserProvider>
  );
}

export default App;