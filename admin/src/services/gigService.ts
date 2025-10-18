import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084/api/gigs';

// Set up axios to include credentials if needed
axios.defaults.withCredentials = true;

export interface GigImage {
  url: string;
  isPrimary: boolean;
}

export interface GigPackage {
  id?: string;
  name: string;
  price: number;
  deliveryDays: number;
  description: string;
}

export interface GigFAQ {
  question: string;
  answer: string;
}

export interface Gig {
  id?: string;
  sellerId: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE' | 'Active' | 'Paused';
  images: GigImage[];
  packages: GigPackage[];
  faqs: GigFAQ[];
  averageRating?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
  sellerName?: string; // For admin display
}

class AdminGigService {
  /**
   * Get all gigs (admin view)
   */
  async getAllGigs(): Promise<Gig[]> {
    try {
      const response = await axios.get<Gig[]>(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching all gigs:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch gigs';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch gigs');
    }
  }

  /**
   * Update gig status (admin action)
   */
  async updateGigStatus(gigId: string, status: 'ACTIVE' | 'INACTIVE' | 'Active' | 'Paused'): Promise<Gig> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${gigId}/status`, { status }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating gig status:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update gig status';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update gig status');
    }
  }

  /**
   * Get gig by ID
   */
  async getGigById(gigId: string): Promise<Gig> {
    try {
      const response = await axios.get<Gig>(`${API_BASE_URL}/${gigId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching gig:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch gig';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch gig');
    }
  }
}

// Export a singleton instance
export const adminGigService = new AdminGigService();

export default AdminGigService;