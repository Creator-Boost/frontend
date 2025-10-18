import React, { useState, useEffect } from 'react';
import { reviewService } from '../services/reviewService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';

const ReviewDebugger: React.FC = () => {
  const [debugData, setDebugData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const debugReviews = async () => {
      try {
        // Fetch all orders to see the data structure
        const orders = await orderService.getAllOrders();
        console.log('All orders:', orders);

        // Find orders with reviews
        const ordersWithReviews = orders.filter(order => order.review);
        console.log('Orders with reviews:', ordersWithReviews);

        if (ordersWithReviews.length > 0) {
          const firstOrder = ordersWithReviews[0];
          console.log('First order with review:', firstOrder);

          // Try to fetch the user profile for this buyer
          try {
            const userProfile = await userService.getUserProfile(firstOrder.buyerId);
            console.log('User profile for buyer:', userProfile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }

          // Test review fetching for this gig
          if (firstOrder.gigId) {
            const reviews = await reviewService.getReviewsForGig(firstOrder.gigId);
            console.log('Processed reviews:', reviews);
          }
        }

        setDebugData({
          totalOrders: orders.length,
          ordersWithReviews: ordersWithReviews.length,
          sampleOrder: ordersWithReviews[0] || null
        });

      } catch (error) {
        console.error('Debug error:', error);
      } finally {
        setLoading(false);
      }
    };

    debugReviews();
  }, []);

  if (loading) {
    return <div className="p-4">Loading debug data...</div>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Review Debug Information</h3>
      <div className="space-y-4">
        <div>
          <strong>Total Orders:</strong> {debugData?.totalOrders || 0}
        </div>
        <div>
          <strong>Orders with Reviews:</strong> {debugData?.ordersWithReviews || 0}
        </div>
        {debugData?.sampleOrder && (
          <div>
            <strong>Sample Order Data:</strong>
            <pre className="bg-white p-2 rounded text-xs overflow-auto">
              {JSON.stringify(debugData.sampleOrder, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Check the browser console for detailed logs about the review fetching process.
      </p>
    </div>
  );
};

export default ReviewDebugger;