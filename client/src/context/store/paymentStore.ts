import { create } from 'zustand';
import { paymentService, UserPurchase } from '../../services/paymentService';

interface PaymentState {
  // State
  userPurchases: UserPurchase[];
  isCheckingPurchases: boolean;
  error: string | null;
  
  // Actions
  fetchUserPurchases: () => Promise<void>;
  hasUserPurchasedService: (serviceId: string) => boolean;
  getServicePurchase: (serviceId: string) => UserPurchase | null;
  addPurchase: (purchase: UserPurchase) => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  // Initial state
  userPurchases: [],
  isCheckingPurchases: false,
  error: null,

  // Fetch user's purchase history
  fetchUserPurchases: async () => {
    set({ isCheckingPurchases: true, error: null });
    try {
      const purchases = await paymentService.getUserPurchases();
      set({ 
        userPurchases: purchases,
        isCheckingPurchases: false 
      });
    } catch (error) {
      console.error('Error fetching user purchases:', error);
      set({ 
        error: 'Failed to fetch purchase history',
        isCheckingPurchases: false 
      });
    }
  },

  // Check if user has purchased a specific service
  hasUserPurchasedService: (serviceId: string) => {
    const { userPurchases } = get();
    return userPurchases.some(
      purchase => 
        purchase.serviceId === serviceId && 
        purchase.status === 'COMPLETED'
    );
  },

  // Get purchase details for a specific service
  getServicePurchase: (serviceId: string) => {
    const { userPurchases } = get();
    return userPurchases.find(
      purchase => 
        purchase.serviceId === serviceId && 
        purchase.status === 'COMPLETED'
    ) || null;
  },

  // Add a new purchase (useful after successful payment)
  addPurchase: (purchase: UserPurchase) => {
    const { userPurchases } = get();
    set({ 
      userPurchases: [...userPurchases, purchase]
    });
  },

  // Clear error state
  clearError: () => {
    set({ error: null });
  }
}));
