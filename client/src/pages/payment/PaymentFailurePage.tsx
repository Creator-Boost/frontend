import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { paymentService } from '../../services/paymentService';
import toast from 'react-hot-toast';

const PaymentFailurePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  
  // Get session ID from URL params (from Stripe redirect)
  const sessionId = searchParams.get('session_id');
  const errorMessage = searchParams.get('error') || 'Payment could not be processed';

  useEffect(() => {
    // Get stored order details from localStorage
    const pendingOrderStr = localStorage.getItem('pendingOrder');
    if (pendingOrderStr) {
      const pendingOrder = JSON.parse(pendingOrderStr);
      setOrderDetails(pendingOrder);
    }

    // Handle payment failure
    if (sessionId) {
      paymentService.handlePaymentFailure(sessionId, errorMessage);
    }

    // Show error toast
    toast.error('Payment failed. Please try again.', {
      duration: 5000,
    });
  }, [sessionId, errorMessage]);

  const handleRetryPayment = () => {
    if (orderDetails?.gigId) {
      // Navigate back to the service page to retry payment
      navigate(`/service/${orderDetails.gigId}`);
    } else {
      // Fallback to services page
      navigate('/services');
    }
  };

  const handleGoToHome = () => {
    // Clear the pending order since user is abandoning the purchase
    localStorage.removeItem('pendingOrder');
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Error Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Failed
        </h1>
        
        <p className="text-gray-600 mb-6">
          We're sorry, but your payment could not be processed at this time.
        </p>

        {/* Error Details */}
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <p className="text-red-700 text-sm mb-3">
            <strong>Error:</strong> {errorMessage}
          </p>
          {orderDetails && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium text-gray-900">{orderDetails.gigTitle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-medium text-gray-900">{orderDetails.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-gray-900">₹{orderDetails.amount}</span>
              </div>
              {sessionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Session ID:</span>
                  <span className="font-medium text-gray-900 text-xs">{sessionId.substring(0, 20)}...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Payment Again
          </button>
          
          <button
            onClick={handleGoBack}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <button
            onClick={handleGoToHome}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">
            Having trouble with payment?
          </p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Check your card details and try again</p>
            <p>• Ensure you have sufficient funds</p>
            <p>• Contact your bank if the issue persists</p>
            <p>• Try using a different payment method</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
