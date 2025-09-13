import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1';

export interface PaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
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
   * Create a payment intent for a service package
   */
  async createPaymentIntent(
    serviceId: string,
    packageName: string,
    amount: number
  ): Promise<PaymentIntent> {
    try {
      const response = await axios.post<PaymentIntent>(`${API_URL}/payments/create-intent`, {
        serviceId,
        packageName,
        amount
      });
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm a payment after successful Stripe processing
   */
  async confirmPayment(paymentIntentId: string): Promise<PaymentResult> {
    try {
      const response = await axios.post<PaymentResult>(`${API_URL}/payments/confirm`, {
        paymentIntentId
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Get user's purchase history
   */
  async getUserPurchases(): Promise<UserPurchase[]> {
    try {
      const response = await axios.get<UserPurchase[]>(`${API_URL}/payments/purchases`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      throw error;
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

  /**
   * Process payment success callback from Stripe
   */
  async processPaymentSuccess(
    paymentIntentId: string,
    serviceId: string
  ): Promise<PaymentResult> {
    try {
      const response = await axios.post<PaymentResult>(`${API_URL}/payments/success`, {
        paymentIntentId,
        serviceId
      });
      return response.data;
    } catch (error) {
      console.error('Error processing payment success:', error);
      throw error;
    }
  }

  /**
   * Process payment failure callback from Stripe
   */
  async processPaymentFailure(
    paymentIntentId: string,
    errorMessage: string
  ): Promise<void> {
    try {
      await axios.post(`${API_URL}/payments/failure`, {
        paymentIntentId,
        errorMessage
      });
    } catch (error) {
      console.error('Error processing payment failure:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
