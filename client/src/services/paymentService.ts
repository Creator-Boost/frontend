import axios from 'axios';

const PAYMENT_API_URL = 'http://localhost:8086/product/v1';

// Set up axios to include credentials if needed
axios.defaults.withCredentials = true;

export interface CheckoutRequest {
  amount: number;
  quantity: number;
  currency: string;
  name: string;
}

export interface CheckoutResponse {
  status: string;
  message: string;
  sessionId: string;
  sessionUrl: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

export interface UserPurchase {
  id: string;
  serviceId: string;
  serviceTitle: string;
  packageName: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

class PaymentService {
  /**
   * Create a checkout session for a gig package
   */
  async createCheckoutSession(amount: number): Promise<CheckoutResponse> {
    try {
      const requestData: CheckoutRequest = {
        amount: amount,
        quantity: 1,
        currency: "INR",
        name: "gigs"
      };

      const response = await axios.post<CheckoutResponse>(`${PAYMENT_API_URL}/checkout`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create checkout session';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Redirect user to Stripe checkout
   */
  redirectToCheckout(sessionUrl: string): void {
    window.location.href = sessionUrl;
  }

  /**
   * Handle payment success (called from success page)
   */
  async handlePaymentSuccess(sessionId: string, _gigId: string, _packageId: string, _buyerId: string, _requirements: string): Promise<any> {
    try {
      // Log the successful payment
      console.log('Payment successful for session:', sessionId);
      
      // Here you could call your backend to log the successful payment
      // or update any payment tracking if needed
      
      return { success: true, sessionId };
    } catch (error) {
      console.error('Error handling payment success:', error);
      throw error;
    }
  }

  /**
   * Handle payment failure (called from failure page)
   */
  async handlePaymentFailure(sessionId: string, errorMessage?: string): Promise<void> {
    try {
      console.log('Payment failed for session:', sessionId, 'Error:', errorMessage);
      // You could log this to your backend or update order status
    } catch (error) {
      console.error('Error handling payment failure:', error);
      throw error;
    }
  }

  /**
   * Get user's purchase history
   */
  async getUserPurchases(): Promise<UserPurchase[]> {
    try {
      // This would need to be implemented in your backend
      // For now, returning empty array
      return [];
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      return [];
    }
  }

  /**
   * Check if user has purchased a specific service
   */
  async hasUserPurchasedService(serviceId: string): Promise<boolean> {
    try {
      const purchases = await this.getUserPurchases();
      return purchases.some(
        purchase => 
          purchase.serviceId === serviceId && 
          purchase.status === 'COMPLETED'
      );
    } catch (error) {
      console.error('Error checking purchase status:', error);
      return false;
    }
  }

  /**
   * Get purchase details for a specific service
   */
  async getServicePurchase(serviceId: string): Promise<UserPurchase | null> {
    try {
      const purchases = await this.getUserPurchases();
      return purchases.find(
        purchase => 
          purchase.serviceId === serviceId && 
          purchase.status === 'COMPLETED'
      ) || null;
    } catch (error) {
      console.error('Error fetching service purchase:', error);
      return null;
    }
  }
}

export const paymentService = new PaymentService();
