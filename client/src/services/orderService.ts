import axios from 'axios';
import { useAuthStore } from '../context/store/authStore';

const ORDER_API_URL = 'http://localhost:8085/api/orders';
const GIG_API_URL = 'http://localhost:8084/api/gigs';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export const ORDER_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  UNDER_TESTING: 'Under Testing',
  PENDING_REVIEW: 'Pending Review',
  DELIVERED: 'Delivered'
} as const;

export const ORDER_STATUS_PERCENTAGE = {
  'Not Started': 0,
  'In Progress': 40,
  'Under Testing': 80,
  'Pending Review': 90,
  'Delivered': 100
} as const;

export interface CreateOrderRequest {
  gigId: string;
  packageId: string; // Revert back to packageId
  buyerId: string;
  requirements: string;
  gigPackageId?: string;
  sellerId?: string;
  amount?: number;
  packageName?: string;
  deliveryDate?: string;
}

export interface UpdateStatusRequest {
  status: keyof typeof ORDER_STATUS;
}

export interface UpdateRequirementsRequest {
  requirements: string;
}

export interface Order {
  id: string;
  gigId: string;
  gigPackageId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  packageName: string;
  requirements: string;
  status: keyof typeof ORDER_STATUS;
  orderDate: string;
  deliveryDate: string;
  gigTitle: string;
  gigDescription: string;
  packageDescription: string;
  deliveryFiles?: string[];
}

export interface GigPackage {
  id: string;
  name: string;
  price: number;
  deliveryDays: number;
  description: string;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  sellerId: string;
  platform: string;
  category: string;
  status: string;
  packages: GigPackage[];
  images: Array<{
    url: string;
    isPrimary: boolean;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  createdAt?: string;
  updatedAt?: string;
}

class OrderService {
  /**
   * Get gig details by ID from gig service
   */
  async getGigById(gigId: string): Promise<Gig> {
    try {
      const response = await axios.get<Gig>(`${GIG_API_URL}/${gigId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gig details:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch gig details';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch gig details');
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      console.log('Creating order with data:', JSON.stringify(orderData, null, 2));
      console.log('Sending to URL:', ORDER_API_URL);
      
      const response = await axios.post<Order>(ORDER_API_URL, orderData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response status:', error.response?.status);
        console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
        console.error('Response headers:', error.response?.headers);
        console.error('Request data:', JSON.stringify(error.config?.data, null, 2));
        console.error('Request URL:', error.config?.url);
        const errorMessage = error.response?.data?.message || error.response?.data?.error || error.response?.data || 'Failed to create order';
        throw new Error(`Bad Request: ${JSON.stringify(errorMessage)}`);
      }
      throw new Error('Failed to create order');
    }
  }

  /**
   * Get all orders for the current user
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(ORDER_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch orders';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch orders');
    }
  }

  /**
   * Get specific order by ID
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
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: keyof typeof ORDER_STATUS): Promise<Order> {
    try {
      const response = await axios.patch<Order>(`${ORDER_API_URL}/${orderId}/status`, 
        { status } as UpdateStatusRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update order status';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update order status');
    }
  }

  /**
   * Get orders by buyer ID
   */
  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(`${ORDER_API_URL}/buyer/${buyerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching buyer orders:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch buyer orders';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch buyer orders');
    }
  }

  /**
   * Get orders by seller ID
   */
  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    try {
      const response = await axios.get<Order[]>(`${ORDER_API_URL}/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch seller orders';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch seller orders');
    }
  }

  /**
   * Add delivery files to order (for sellers)
   */
  async addDeliveryFiles(orderId: string, files: FileList): Promise<Order> {
    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const response = await axios.post<Order>(`${ORDER_API_URL}/${orderId}/delivery-files`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error adding delivery files:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to add delivery files';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to add delivery files');
    }
  }

  /**
   * Update order requirements (for buyers)
   */
  async updateRequirements(orderId: string, requirements: string): Promise<Order> {
    try {
      const response = await axios.patch<Order>(`${ORDER_API_URL}/${orderId}/requirements`,
        { requirements } as UpdateRequirementsRequest,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating requirements:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update requirements';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update requirements');
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    try {
      const response = await axios.patch<Order>(`${ORDER_API_URL}/${orderId}/cancel`, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to cancel order';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to cancel order');
    }
  }

  /**
   * Get status percentage for progress display
   */
  getStatusPercentage(status: keyof typeof ORDER_STATUS): number {
    return ORDER_STATUS_PERCENTAGE[ORDER_STATUS[status] as keyof typeof ORDER_STATUS_PERCENTAGE];
  }

  /**
   * Get user ID from auth store
   */
  getUserId(): string {
    const { user } = useAuthStore.getState();
    if (!user?.userId) {
      throw new Error('User not authenticated');
    }
    return user.userId;
  }

  /**
   * Check if user is buyer of an order
   */
  isOrderBuyer(order: Order): boolean {
    try {
      const userId = this.getUserId();
      return order.buyerId === userId;
    } catch {
      return false;
    }
  }

  /**
   * Check if user is seller of an order
   */
  isOrderSeller(order: Order): boolean {
    try {
      const userId = this.getUserId();
      return order.sellerId === userId;
    } catch {
      return false;
    }
  }

  /**
   * Get formatted status display
   */
  getStatusDisplay(status: keyof typeof ORDER_STATUS): {
    label: string;
    percentage: number;
    color: string;
  } {
    const label = ORDER_STATUS[status];
    const percentage = this.getStatusPercentage(status);
    
    let color = 'bg-gray-100 text-gray-800';
    switch (label) {
      case 'Not Started':
        color = 'bg-gray-100 text-gray-800';
        break;
      case 'In Progress':
        color = 'bg-blue-100 text-blue-800';
        break;
      case 'Under Testing':
        color = 'bg-yellow-100 text-yellow-800';
        break;
      case 'Pending Review':
        color = 'bg-orange-100 text-orange-800';
        break;
      case 'Delivered':
        color = 'bg-green-100 text-green-800';
        break;
    }

    return { label, percentage, color };
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
export const orderService = new OrderService();

// Export the class as well for dependency injection if needed
export default OrderService;