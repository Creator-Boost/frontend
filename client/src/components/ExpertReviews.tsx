import React, { useState, useEffect } from 'react';
import { Star, TrendingUp, MessageSquare, Award, User } from 'lucide-react';
import ReviewList from './ReviewList';
import { type Review } from '../services/reviewService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import { useAuthStore } from '../context/store/authStore';

interface ExpertReviewsProps {
  userId?: string;
}

const ExpertReviews: React.FC<ExpertReviewsProps> = ({ userId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewStats, setReviewStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  
  const { user } = useAuthStore();
  const expertId = userId || user?.userId;

  useEffect(() => {
    fetchExpertReviews();
  }, [expertId]);

  const fetchExpertReviews = async () => {
    if (!expertId) {
      setError('Expert ID not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get all orders for this expert (seller)
      const allOrders = await orderService.getAllOrders();
      const expertOrders = allOrders.filter(order => order.sellerId === expertId);
      
      console.log('Orders data:', expertOrders);
      
      // Filter orders that have reviews with valid data
      const ordersWithReviews = expertOrders.filter(order => {
        const hasValidReview = order.review && 
          order.review.rating && 
          order.review.reviewText && 
          order.review.reviewText.trim().length > 0;
        
        return hasValidReview;
      });
      
      // Extract reviews from orders
      const expertReviewsWithoutAvatars: Review[] = ordersWithReviews.map(order => {
        const review = order.review!; // We know it exists from filtering
        
        return {
          id: review.id,
          orderId: order.id,
          gigId: order.gigId,
          reviewerId: review.reviewerId,
          reviewerName: order.buyerName || 'Anonymous User',
          reviewerAvatar: undefined, // Will be populated below
          rating: review.rating,
          reviewText: review.reviewText,
          createdAt: review.createdAt,
          packageName: order.packageName || 'Standard Package'
        };
      });

      // Fetch reviewer profile pictures and names
      const expertReviews = await Promise.all(
        expertReviewsWithoutAvatars.map(async (review: Review) => {
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
      expertReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setReviews(expertReviews);

      // Calculate review statistics
      if (expertReviews.length > 0) {
        const totalRating = expertReviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = totalRating / expertReviews.length;
        
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        expertReviews.forEach(review => {
          distribution[review.rating as keyof typeof distribution]++;
        });

        setReviewStats({
          totalReviews: expertReviews.length,
          averageRating: Math.round(averageRating * 100) / 100,
          ratingDistribution: distribution
        });
      } else {
        setReviewStats({
          totalReviews: 0,
          averageRating: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
      }

    } catch (err) {
      console.error('Error fetching expert reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const getPercentage = (count: number) => {
    if (reviewStats.totalReviews === 0) return 0;
    return Math.round((count / reviewStats.totalReviews) * 100);
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">My Reviews</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 mr-2 border-b-2 rounded-full border-emerald-600 animate-spin"></div>
          <span className="text-gray-600">Loading reviews...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">My Reviews</h3>
        <div className="py-8 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="font-medium text-red-600">Error loading reviews</p>
          <p className="text-sm text-red-500">{error}</p>
          <button 
            onClick={fetchExpertReviews}
            className="px-4 py-2 mt-4 text-white transition-colors bg-red-500 rounded-lg hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Review Summary Stats */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-gray-900">Review Summary</h3>
        
        <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-3">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <span className="mr-2 text-3xl font-bold text-gray-900">
                {reviewStats.averageRating.toFixed(1)}
              </span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(reviewStats.averageRating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>

          {/* Total Reviews */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="w-8 h-8 mr-2 text-emerald-500" />
              <span className="text-3xl font-bold text-gray-900">
                {reviewStats.totalReviews}
              </span>
            </div>
            <p className="text-sm text-gray-600">Total Reviews</p>
          </div>

          {/* Positive Rating Percentage */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-8 h-8 mr-2 text-green-500" />
              <span className="text-3xl font-bold text-gray-900">
                {reviewStats.totalReviews > 0 
                  ? Math.round(((reviewStats.ratingDistribution[4] + reviewStats.ratingDistribution[5]) / reviewStats.totalReviews) * 100)
                  : 0}%
              </span>
            </div>
            <p className="text-sm text-gray-600">4+ Star Reviews</p>
          </div>
        </div>

        {/* Rating Distribution */}
        {reviewStats.totalReviews > 0 && (
          <div>
            <h4 className="mb-4 font-medium text-gray-900 text-md">Rating Breakdown</h4>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <span className="flex items-center w-12 text-gray-600">
                    {rating} <Star className="w-3 h-3 ml-1 text-yellow-400 fill-current" />
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 transition-all duration-300 bg-yellow-400 rounded-full"
                        style={{ width: `${getPercentage(reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution])}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-16 text-right text-gray-500">
                    {reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution]} ({getPercentage(reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution])}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Individual Reviews */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Customer Reviews ({reviewStats.totalReviews})
        </h3>
        
        {reviews.length === 0 ? (
          <div className="py-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="mb-2 text-lg font-medium text-gray-900">No Reviews Yet</h4>
            <p className="mb-4 text-gray-600">
              Complete some orders to start receiving reviews from your clients.
            </p>
            <div className="flex items-center justify-center text-sm text-gray-500">
              <User className="w-4 h-4 mr-1" />
              <span>Reviews will appear here after order completion</span>
            </div>
            {/* Debug info */}
            <div className="p-2 mt-4 text-xs text-red-600 rounded bg-red-50">
              Debug: Reviews array length = {reviews.length}
            </div>
          </div>
        ) : (
          <ReviewList
            reviews={reviews}
            loading={false}
            emptyMessage="No reviews found"
            emptySubMessage="Complete orders to receive reviews"
          />
        )}
      </div>
    </div>
  );
};

export default ExpertReviews;