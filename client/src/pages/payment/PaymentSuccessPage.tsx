import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home, Loader, AlertCircle } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { gigService } from '../../services/gigService';
import toast from 'react-hot-toast';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isCreatingOrder, setIsCreatingOrder] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const hasProcessedPayment = useRef(false); // Prevent duplicate processing
  
  // Get session ID from URL params (from Stripe redirect)
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Prevent duplicate processing (React StrictMode or re-renders)
    if (!hasProcessedPayment.current) {
      hasProcessedPayment.current = true;
      handlePaymentSuccess();
    }

    // Cleanup function to reset the flag if component unmounts
    return () => {
      // Don't reset the flag on unmount since we want to prevent duplicates
      // across multiple renders of the same payment session
    };
  }, [sessionId]); // Add sessionId as dependency

  const handlePaymentSuccess = async () => {
    console.log('handlePaymentSuccess called, sessionId:', sessionId);
    
    try {
      // Get stored order details from localStorage
      const pendingOrderStr = localStorage.getItem('pendingOrder');
      if (!pendingOrderStr) {
        throw new Error('No pending order found');
      }

      const pendingOrder = JSON.parse(pendingOrderStr);
      setOrderDetails(pendingOrder);

      // Check if this order has already been processed to prevent duplicates
      const processedOrderKey = `processed_order_${sessionId}`;
      if (sessionId && localStorage.getItem(processedOrderKey)) {
        console.log('Order already processed for session:', sessionId);
        setIsCreatingOrder(false);
        return;
      }

      console.log('Creating order for session:', sessionId);
      console.log('Pending order details:', JSON.stringify(pendingOrder, null, 2));

      // Handle payment success in payment service
      if (sessionId) {
        await paymentService.handlePaymentSuccess(
          sessionId,
          pendingOrder.gigId,
          pendingOrder.packageId,
          pendingOrder.buyerId,
          pendingOrder.requirements
        );
      }

      // Fetch gig details to get missing information
      console.log('Fetching gig details for gigId:', pendingOrder.gigId);
      const gig = await gigService.getGigById(pendingOrder.gigId);
      
      if (!gig) {
        throw new Error('Gig not found');
      }
      
      const packageIndex = parseInt(pendingOrder.packageId);
      
      if (packageIndex < 0 || packageIndex >= gig.packages.length) {
        throw new Error('Invalid package index');
      }
      
      const selectedPackage = gig.packages[packageIndex];

      if (!selectedPackage) {
        throw new Error('Selected package not found');
      }

      console.log('Found gig:', gig.title);
      console.log('Selected package:', selectedPackage.name, 'Price:', selectedPackage.price);
      console.log('Gig sellerId:', gig.sellerId);
      console.log('Package index:', pendingOrder.packageId);

      // Calculate delivery date (order date + delivery days)
      const orderDate = new Date();
      const deliveryDate = new Date(orderDate);
      deliveryDate.setDate(deliveryDate.getDate() + selectedPackage.deliveryDays);

      console.log('Calculated delivery date:', deliveryDate.toISOString(), 'from', selectedPackage.deliveryDays, 'days');

      // Create the actual order now that payment is successful
      // Add the additional fields to populate the null values
      const orderData = {
        gigId: pendingOrder.gigId,
        packageId: pendingOrder.packageId,
        buyerId: pendingOrder.buyerId,
        requirements: pendingOrder.requirements,
        // Additional fields from gig service to populate null values
        sellerId: gig.sellerId,
        amount: selectedPackage.price,
        packageName: selectedPackage.name,
        deliveryDate: deliveryDate.toISOString()
      };

      console.log('About to create order with complete data:', JSON.stringify(orderData, null, 2));
      await orderService.createOrder(orderData);
      console.log('Order created successfully');
      
      // Mark this session as processed to prevent duplicate orders
      if (sessionId) {
        localStorage.setItem(processedOrderKey, 'true');
      }
      
      // Clear the pending order from localStorage
      localStorage.removeItem('pendingOrder');
      
      // Show success toast
      toast.success('Payment completed and order created successfully!', {
        duration: 5000,
      });

    } catch (err) {
      console.error('Error handling payment success:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order after payment');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleContinueToService = () => {
    if (orderDetails?.gigId) {
      // Navigate to the service detail page
      navigate(`/service/${orderDetails.gigId}`);
    } else {
      // Fallback to services page
      navigate('/services');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard/client');
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  if (isCreatingOrder) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Your Order
          </h1>
          <p className="text-gray-600">
            Payment successful! We're finalizing your order details...
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Fetching service information and creating complete order record
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Creation Failed
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment was successful, but we encountered an issue creating your order. Please contact support.
          </p>
          <p className="text-sm text-red-600 mb-6">
            Error: {error}
          </p>
          <button
            onClick={handleGoToHome}
            className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

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
          Order Created Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your payment has been processed and your order has been created.
        </p>

        {/* Order Details */}
        {orderDetails && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleGoToDashboard}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            View My Orders
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={handleContinueToService}
            className="w-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3 px-6 rounded-lg font-semibold transition-colors"
          >
            View Service Details
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
            You can track your order status in your dashboard. The seller will be notified and will start working on your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
