import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/store/authStore';
import { paymentService } from '../services/paymentService';
import toast from 'react-hot-toast';

interface PaymentButtonProps {
  serviceId: string;
  serviceTitle: string;
  packageName: string;
  amount: number;
  className?: string;
  children: React.ReactNode;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  serviceId,
  serviceTitle,
  packageName,
  amount,
  className = '',
  children
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to purchase this service');
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      // Create payment intent with your Spring Boot backend
      const paymentIntent = await paymentService.createPaymentIntent(
        serviceId,
        packageName,
        amount
      );

      // In a real implementation, you would integrate with Stripe here
      // For now, we'll simulate the payment flow
      
      // Example of how you might integrate with Stripe:
      /*
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?service_id=${serviceId}&service_title=${encodeURIComponent(serviceTitle)}&package_name=${encodeURIComponent(packageName)}&amount=${amount}`,
        },
      });

      if (error) {
        const failureUrl = `/payment/failure?service_id=${serviceId}&service_title=${encodeURIComponent(serviceTitle)}&package_name=${encodeURIComponent(packageName)}&amount=${amount}&error=${encodeURIComponent(error.message)}`;
        navigate(failureUrl);
      }
      */
      
      // For demonstration, we'll redirect to success page after a delay
      setTimeout(() => {
        const successUrl = `/payment/success?service_id=${serviceId}&service_title=${encodeURIComponent(serviceTitle)}&package_name=${encodeURIComponent(packageName)}&amount=${amount}`;
        navigate(successUrl);
      }, 2000);

      toast.success('Redirecting to payment...');

    } catch (error) {
      console.error('Payment error:', error);
      const failureUrl = `/payment/failure?service_id=${serviceId}&service_title=${encodeURIComponent(serviceTitle)}&package_name=${encodeURIComponent(packageName)}&amount=${amount}&error=${encodeURIComponent('Payment could not be initiated')}`;
      navigate(failureUrl);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default PaymentButton;
