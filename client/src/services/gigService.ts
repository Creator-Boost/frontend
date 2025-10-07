import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084/api/gigs';

// Set up axios to include credentials if needed
axios.defaults.withCredentials = true;

export interface GigImage {
  url: string;
  isPrimary: boolean;
}

export interface GigPackage {
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
  status: 'ACTIVE' | 'INACTIVE';
  images: GigImage[];
  packages: GigPackage[];
  faqs: GigFAQ[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateGigRequest {
  sellerId: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  images: GigImage[];
  packages: GigPackage[];
  faqs: GigFAQ[];
}

export interface ImageUploadResponse {
  imageUrl: string;
  message: string;
}

class GigService {
  /**
   * Upload an image to Cloudinary
   */
  async uploadImage(file: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Create a new gig
   */
  async createGig(gigData: CreateGigRequest): Promise<Gig> {
    try {
      const response = await axios.post(API_BASE_URL, gigData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error creating gig:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create gig';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create gig');
    }
  }

  /**
   * Get all gigs (for verification purposes)
   */
  async getAllGigs(): Promise<Gig[]> {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching gigs:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch gigs';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch gigs');
    }
  }

  /**
   * Get gigs by seller ID
   */
  async getGigsBySeller(sellerId: string): Promise<Gig[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/seller/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seller gigs:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch seller gigs';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch seller gigs');
    }
  }

  /**
   * Get a specific gig by ID
   */
  async getGigById(gigId: string): Promise<Gig> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${gigId}`);
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

  /**
   * Update an existing gig
   */
  async updateGig(gigId: string, gigData: Partial<CreateGigRequest>): Promise<Gig> {
    try {
      const response = await axios.put(`${API_BASE_URL}/${gigId}`, gigData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error updating gig:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to update gig';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to update gig');
    }
  }

  /**
   * Delete a gig
   */
  async deleteGig(gigId: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${gigId}`);
    } catch (error) {
      console.error('Error deleting gig:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to delete gig';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to delete gig');
    }
  }

  /**
   * Update gig status (ACTIVE/INACTIVE)
   */
  async updateGigStatus(gigId: string, status: 'ACTIVE' | 'INACTIVE'): Promise<Gig> {
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
}

// Export a singleton instance
export const gigService = new GigService();

// Export the class as well for dependency injection if needed
export default GigService;
