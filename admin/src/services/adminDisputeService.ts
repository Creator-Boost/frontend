import axios from 'axios';

const ORDER_API_URL = 'http://localhost:8085/api/orders';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export interface Dispute {
  id: string;
  title: string;
  description: string;
  createdDate: string;
  userId: string;
  resolved?: boolean;
}

export interface OrderWithDisputes {
  id: string;
  gigId: string;
  gigPackageId: string;
  buyerId: string;
  sellerId: string;
  buyerName?: string;
  sellerName?: string;
  amount: number;
  packageName: string;
  requirements: string;
  status: string;
  orderDate: string;
  deliveryDate: string;
  gigTitle?: string;
  gigDescription?: string;
  packageDescription?: string;
  deliveredFiles?: string;
  payments: any[];
  review: any;
  disputes: Dispute[];
}

export interface UpdateDisputeStatusRequest {
  resolved: boolean;
}

class AdminDisputeService {
  /**
   * Get all orders that have disputes
   */
  async getOrdersWithDisputes(): Promise<OrderWithDisputes[]> {
    try {
      // First get all orders
      const allOrdersResponse = await axios.get(`${ORDER_API_URL}`);
      const allOrders = allOrdersResponse.data;
      
      // Then get orders with disputes for each order that might have disputes
      const ordersWithDisputes: OrderWithDisputes[] = [];
      
      for (const order of allOrders) {
        try {
          const orderWithDisputesResponse = await axios.get(`${ORDER_API_URL}/${order.id}/with-disputes`);
          const orderWithDisputes = orderWithDisputesResponse.data;
          
          // Only include orders that actually have disputes
          if (orderWithDisputes.disputes && orderWithDisputes.disputes.length > 0) {
            ordersWithDisputes.push(orderWithDisputes);
          }
        } catch (error) {
          // Skip orders that don't have the with-disputes endpoint or have errors
          continue;
        }
      }
      
      return ordersWithDisputes;
    } catch (error) {
      console.error('Error fetching orders with disputes:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch orders with disputes';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch orders with disputes');
    }
  }

  /**
   * Get all disputes for a specific order
   */
  async getDisputesByOrderId(orderId: string): Promise<Dispute[]> {
    try {
      const response = await axios.get<Dispute[]>(`${ORDER_API_URL}/${orderId}/disputes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching disputes for order:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch disputes';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch disputes');
    }
  }

  /**
   * Update dispute status (mark as resolved/unresolved)
   */
  async updateDisputeStatus(disputeId: string, resolved: boolean): Promise<void> {
    try {
      await axios.patch(`${ORDER_API_URL}/disputes/${disputeId}/status`, 
        { resolved } as UpdateDisputeStatusRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error updating dispute status:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update dispute status';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update dispute status');
    }
  }

  /**
   * Get formatted date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get dispute priority based on amount and age
   */
  getDisputePriority(order: OrderWithDisputes, dispute: Dispute): 'high' | 'medium' | 'low' {
    const amount = order.amount;
    const daysSinceCreated = Math.floor((Date.now() - new Date(dispute.createdDate).getTime()) / (1000 * 60 * 60 * 24));
    
    // High priority: high amount or old disputes
    if (amount > 1000 || daysSinceCreated > 7) {
      return 'high';
    }
    // Medium priority: medium amount or moderately old
    if (amount > 200 || daysSinceCreated > 3) {
      return 'medium';
    }
    // Low priority: everything else
    return 'low';
  }
}

// Export a singleton instance
export const adminDisputeService = new AdminDisputeService();

export default AdminDisputeService;