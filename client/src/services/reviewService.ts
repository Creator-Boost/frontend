import axios from 'axios';
import { userService } from './userService';

const REVIEW_API_URL = 'http://localhost:8085/api/orders';

// Set up axios to include credentials
axios.defaults.withCredentials = true;

export interface Review {
  id: string;
  orderId: string;
  gigId: string;
  reviewerId: string; // buyerId from order
  reviewerName?: string;
  reviewerAvatar?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  packageName?: string;
}

export interface CreateReviewRequest {
  rating: number;
  reviewText: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

class ReviewService {
  /**
   * Create a review for an order
   */
  async createReview(orderId: string, reviewData: CreateReviewRequest): Promise<Review> {
    try {
      const response = await axios.post<Review>(`${REVIEW_API_URL}/${orderId}/review`, reviewData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating review:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create review';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to create review');
    }
  }

  /**
   * Get reviews for a specific gig by fetching all orders and filtering reviews
   */
  async getReviewsForGig(gigId: string): Promise<Review[]> {
    try {
      // Fetch all orders
      const response = await axios.get(`${REVIEW_API_URL}`);
      const orders = response.data;

      // Filter orders for the specific gig that have reviews
      const reviewsWithOrderData = orders
        .filter((order: any) => order.gigId === gigId && order.review)
        .map((order: any) => {
          // Try to get the reviewer name from multiple possible sources
          let reviewerName = order.buyerName || 
                           order.buyer?.name || 
                           order.review.reviewerName || 
                           'Anonymous User';
          
          // If we still have Anonymous User, try to get from user profile later
          return {
            id: order.review.id || `${order.id}_review`,
            orderId: order.id,
            gigId: order.gigId,
            reviewerId: order.buyerId,
            reviewerName: reviewerName,
            reviewerAvatar: null, // Will be populated below
            rating: order.review.rating,
            reviewText: order.review.reviewText,
            createdAt: order.review.createdAt || order.orderDate,
            packageName: order.packageName || 'Standard Package'
          };
        });

      // Fetch reviewer profile pictures and names
      const reviewsWithAvatars = await Promise.all(
        reviewsWithOrderData.map(async (review: Review) => {
          let finalReviewerName = review.reviewerName || 'Anonymous User';
          let reviewerAvatar = userService.getUserAvatarUrl(null, finalReviewerName);

          try {
            const userProfile = await userService.getUserProfile(review.reviewerId);
            
            // Always use the profile name as it's the most up-to-date
            if (userProfile && userProfile.name) {
              finalReviewerName = userProfile.name;
              reviewerAvatar = userService.getUserAvatarUrl(userProfile.imageUrl, finalReviewerName);
            }
            
          } catch (error) {
            // Keep the fallback name and avatar
          }

          return {
            ...review,
            reviewerName: finalReviewerName,
            reviewerAvatar: reviewerAvatar
          };
        })
      );

      // Sort by creation date (newest first)
      return reviewsWithAvatars.sort((a: Review, b: Review) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error('Error fetching reviews for gig:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch reviews';
        throw new Error(errorMessage);
      }
      throw new Error('Failed to fetch reviews');
    }
  }

  /**
   * Get review statistics for a specific gig
   */
  async getReviewStatsForGig(gigId: string): Promise<ReviewStats> {
    try {
      const reviews = await this.getReviewsForGig(gigId);
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = Math.round((totalRating / reviews.length) * 100) / 100; // Round to 2 decimal places

      return {
        averageRating,
        totalReviews: reviews.length
      };
    } catch (error) {
      console.error('Error calculating review stats:', error);
      // Return default stats if there's an error
      return {
        averageRating: 0,
        totalReviews: 0
      };
    }
  }

  /**
   * Check if a user can review an order
   */
  async canReviewOrder(orderId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${REVIEW_API_URL}/${orderId}`);
      const order = response.data;
      
      // Can review if order is delivered/completed and no review exists yet
      return (
        (order.status === 'DELIVERED' || order.status === 'COMPLETED') && 
        !order.review
      );
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      return false;
    }
  }

  /**
   * Format review date for display
   */
  formatReviewDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return '1 day ago';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return years === 1 ? '1 year ago' : `${years} years ago`;
    }
  }

  /**
   * Get orders that can be reviewed by the current user
   */
  async getReviewableOrders(): Promise<any[]> {
    try {
      const response = await axios.get(`${REVIEW_API_URL}`);
      const orders = response.data;

      // Filter orders that can be reviewed (delivered and no existing review)
      return orders.filter((order: any) => 
        (order.status === 'DELIVERED' || order.status === 'COMPLETED') && 
        !order.review
      );
    } catch (error) {
      console.error('Error fetching reviewable orders:', error);
      return [];
    }
  }
}

// Export a singleton instance
export const reviewService = new ReviewService();

// Export the class as well for dependency injection if needed
export default ReviewService;