import React, { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { orderService } from '../services/orderService';

const ReviewTest: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Test fetching orders
        const allOrders = await orderService.getAllOrders();
        setOrders(allOrders);

        // Test fetching reviews for each gig
        const gigIds = [...new Set(allOrders.map(order => order.gigId))];
        const allReviews = await Promise.all(
          gigIds.map(async (gigId) => {
            try {
              const gigReviews = await reviewService.getReviewsForGig(gigId);
              return { gigId, reviews: gigReviews };
            } catch (error) {
              console.error(`Error fetching reviews for gig ${gigId}:`, error);
              return { gigId, reviews: [] };
            }
          })
        );
        setReviews(allReviews);

      } catch (error) {
        console.error('Error in test:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading test data...</div>;
  }

  return (
    <div className="max-w-4xl p-8 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Review System Test</h1>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Orders ({orders.length})</h2>
        <div className="space-y-2">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="p-4 bg-gray-100 rounded">
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Gig ID:</strong> {order.gigId}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Buyer:</strong> {order.buyerName}</p>
              <p><strong>Has Review:</strong> {order.review ? 'Yes' : 'No'}</p>
              {order.review && (
                <div className="p-2 mt-2 bg-yellow-100 rounded">
                  <p><strong>Rating:</strong> {order.review.rating}/5</p>
                  <p><strong>Review:</strong> {order.review.reviewText}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold">Reviews by Gig</h2>
        <div className="space-y-4">
          {reviews.map(({ gigId, reviews: gigReviews }) => (
            <div key={gigId} className="p-4 rounded bg-blue-50">
              <h3 className="font-semibold">Gig ID: {gigId}</h3>
              <p className="text-sm text-gray-600">Reviews: {gigReviews.length}</p>
              {gigReviews.length > 0 && (
                <div className="mt-2 space-y-2">
                  {gigReviews.map((review) => (
                    <div key={review.id} className="p-2 text-sm bg-white rounded">
                      <p><strong>{review.reviewerName}</strong> - {review.rating}/5 stars</p>
                      <p>{review.reviewText}</p>
                      <p className="text-xs text-gray-500">
                        {reviewService.formatReviewDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewTest;