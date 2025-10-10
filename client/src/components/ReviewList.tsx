import React from 'react';
import { Star } from 'lucide-react';
import { userService } from '../services/userService';
import { reviewService, type Review } from '../services/reviewService';

interface ReviewItemProps {
  review: Review;
  showPackageName?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review, showPackageName = true }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to generated avatar if image fails to load
    const target = e.target as HTMLImageElement;
    target.src = userService.getUserAvatarUrl(null, review.reviewerName || 'Anonymous');
  };

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="relative group">
            <img
              src={review.reviewerAvatar || userService.getUserAvatarUrl(null, review.reviewerName || 'Anonymous')}
              alt={review.reviewerName}
              className="w-12 h-12 rounded-full object-cover border-3 border-gray-200 hover:border-emerald-300 transition-all duration-200 shadow-sm hover:shadow-md"
              onError={handleImageError}
            />
            {/* Tooltip on hover */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
              {review.reviewerName}
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center mb-1">
                <h4 className="font-semibold text-gray-900 text-base">{review.reviewerName}</h4>
                <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                  Verified Buyer
                </span>
              </div>
              {showPackageName && (
                <p className="text-sm text-gray-600 font-medium">
                  <span className="text-gray-500">Package:</span> {review.packageName}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${
                      i < review.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="ml-2 text-sm font-bold text-gray-900">
                  {review.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {reviewService.formatReviewDate(review.createdAt)}
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed mb-3">{review.reviewText}</p>
          
          {/* Reviewer info and helpful indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                Verified Purchase
              </span>
              <span className="flex items-center">
                <span className="font-medium text-gray-600">By:</span>
                <span className="ml-1 font-medium text-gray-700">{review.reviewerName}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>Order ID: {review.orderId.substring(0, 8)}...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  emptySubMessage?: string;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading = false,
  error = null,
  emptyMessage = "No reviews yet",
  emptySubMessage = "Be the first to review this service!"
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mr-2"></div>
        <span className="text-gray-600">Loading reviews...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">
          <Star className="h-8 w-8 mx-auto mb-2" />
        </div>
        <p className="text-red-600 font-medium">Error loading reviews</p>
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 font-medium">{emptyMessage}</p>
        <p className="text-sm text-gray-400">{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
};

export { ReviewItem, ReviewList };
export default ReviewList;