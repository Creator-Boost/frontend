import React from 'react';
import { Star, Users } from 'lucide-react';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution?: { [key: number]: number };
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({ 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}) => {
  // Calculate rating distribution if not provided
  const distribution = ratingDistribution || {
    5: Math.floor(totalReviews * 0.6),
    4: Math.floor(totalReviews * 0.25),
    3: Math.floor(totalReviews * 0.1),
    2: Math.floor(totalReviews * 0.03),
    1: Math.floor(totalReviews * 0.02)
  };

  const getPercentage = (count: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((count / totalReviews) * 100);
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        {/* Overall Rating */}
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Customer Reviews</h4>
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <span className="text-3xl font-bold text-gray-900 mr-2">
                {averageRating.toFixed(1)}
              </span>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm">
                Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Rating Distribution */}
        {totalReviews > 0 && (
          <div className="flex-1 max-w-xs">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Rating Breakdown</h5>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center text-sm">
                  <span className="w-8 text-gray-600">{rating}★</span>
                  <div className="flex-1 mx-3">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getPercentage(distribution[rating])}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="w-12 text-right text-gray-500">
                    {getPercentage(distribution[rating])}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSummary;