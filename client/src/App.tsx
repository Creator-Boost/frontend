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
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentFailurePage from './pages/payment/PaymentFailurePage';
import { useAuthStore } from './context/store/authStore';
import { useEffect, useState } from 'react';
import LoadingScreen from './components/LoadingPage';
import UsersList from './pages/users';
import { useChatStore } from './context/store/chatStore';
import Chatbot from './components/Chatbot';

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
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/expert-dashboard" element={<ExpertDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/service/:id" element={<ServiceDetailPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/users" element={<UsersList />} />
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
