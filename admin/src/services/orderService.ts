import axios from 'axios';

const ORDER_API_URL = 'http://localhost:8085/api/orders';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export interface Order {
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
  status: string; // Order status: 'NEW', 'IN_PROGRESS', 'DELIVERED', etc.
  paymentStatus?: 'pending' | 'paid' | 'refunded'; // Payment status for admin
  adminStatus?: 'PENDING' | 'PAID' | 'REFUNDED'; // New admin status field
  orderDate: string;
  deliveryDate: string;
  gigTitle?: string;
  gigDescription?: string;
  packageDescription?: string;
  deliveredFiles?: string;
  payments: any[];
  review: any;
}

export interface UpdatePaymentStatusRequest {
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface UpdateAdminStatusRequest {
  adminStatus: 'PENDING' | 'PAID' | 'REFUNDED';
}

class AdminOrderService {
  /**
   * Get all orders (admin view)
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(ORDER_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all orders:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch orders';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get<Order>(`${ORDER_API_URL}/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch order';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch order');
    }
  }

  /**
   * Update payment status (admin action)
   */
  async updatePaymentStatus(orderId: string, paymentStatus: 'pending' | 'paid' | 'refunded'): Promise<Order> {
    try {
      const response = await axios.patch<Order>(`${ORDER_API_URL}/${orderId}/payment-status`, 
        { paymentStatus } as UpdatePaymentStatusRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating payment status:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update payment status';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update payment status');
    }
  }

  /**
   * Update admin status (new admin action)
   */
  async updateAdminStatus(orderId: string, adminStatus: 'PENDING' | 'PAID' | 'REFUNDED'): Promise<Order> {
    try {
      const response = await axios.patch<Order>(`${ORDER_API_URL}/${orderId}/admin-status`, 
        { adminStatus } as UpdateAdminStatusRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating admin status:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update admin status';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update admin status');
    }
  }

  /**
   * Get status percentage for progress display
   */
  getStatusPercentage(status: string): number {
    const statusMap: { [key: string]: number } = {
      'NEW': 0,
      'NOT_STARTED': 0,
      'IN_PROGRESS': 40,
      'UNDER_TESTING': 80,
      'PENDING_REVIEW': 90,
      'DELIVERED': 100
    };
    
    return statusMap[status] || 0;
  }

  /**
   * Get formatted status display
   */
  getStatusDisplay(status: string): {
    label: string;
    percentage: number;
    color: string;
  } {
    const statusLabels: { [key: string]: string } = {
      'NEW': 'New',
      'NOT_STARTED': 'Not Started',
      'IN_PROGRESS': 'In Progress',
      'UNDER_TESTING': 'Under Testing',
      'PENDING_REVIEW': 'Pending Review',
      'DELIVERED': 'Delivered'
    };
    
    const label = statusLabels[status] || status.replace('_', ' ');
    const percentage = this.getStatusPercentage(status);
    
    let color = 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'NEW':
      case 'NOT_STARTED':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'IN_PROGRESS':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'UNDER_TESTING':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'PENDING_REVIEW':
        color = 'bg-orange-100 text-orange-800';
        break;
      case 'DELIVERED':
        color = 'bg-green-100 text-green-800';
        break;
    }

    return { label, percentage, color };
  }

  /**
   * Get admin status display
   */
  getAdminStatusDisplay(adminStatus: string): {
    label: string;
    color: string;
  } {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'Pending',
      'PAID': 'Paid',
      'REFUNDED': 'Refunded'
    };
    
    const label = statusLabels[adminStatus] || adminStatus;
    
    let color = 'bg-gray-100 text-gray-800';
    switch (adminStatus) {
      case 'PENDING':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'PAID':
        color = 'bg-green-100 text-green-800';
        break;
      case 'REFUNDED':
        color = 'bg-red-100 text-red-800';
        break;
    }

    return { label, color };
  }

  /**
   * Format date for display
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
}

// Export a singleton instance
export const adminOrderService = new AdminOrderService();

export default AdminOrderService;