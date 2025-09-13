import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get payment details from URL params
  const serviceId = searchParams.get('service_id');
  const serviceTitle = searchParams.get('service_title') || 'Service';
  const packageName = searchParams.get('package_name') || 'Package';
  const amount = searchParams.get('amount') || '0';

  useEffect(() => {
    // Show success toast
    toast.success('Payment completed successfully!', {
      duration: 5000,
    });

    // You can add logic here to:
    // 1. Update user's purchased services
    // 2. Send confirmation email
    // 3. Create order record in backend
    // 4. Update service access permissions
  }, []);

  const handleContinueToCourse = () => {
    if (serviceId) {
      // Navigate to the service/course page
      navigate(`/service/${serviceId}`);
    } else {
      // Fallback to services page
      navigate('/services');
    }
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your payment has been processed successfully.
        </p>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Service:</span>
              <span className="font-medium text-gray-900">{serviceTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Package:</span>
              <span className="font-medium text-gray-900">{packageName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-900">${amount}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleContinueToCourse}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            Continue to Course
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleGoToHome}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            You will receive a confirmation email shortly with your purchase details and access instructions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
