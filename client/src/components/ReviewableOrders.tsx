import React, { useState, useEffect } from 'react';
import { Star, Clock, Package } from 'lucide-react';
import { reviewService } from '../services/reviewService';
import { orderService, type Order } from '../services/orderService';
import ReviewModal from './ReviewModal';
import toast from 'react-hot-toast';

const ReviewableOrders: React.FC = () => {
  const [reviewableOrders, setReviewableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchReviewableOrders();
  }, []);

  const fetchReviewableOrders = async () => {
    try {
      setLoading(true);
      const orders = await reviewService.getReviewableOrders();
      setReviewableOrders(orders);
    } catch (error) {
      console.error('Error fetching reviewable orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (order: Order) => {
    setSelectedOrder(order);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    // Refresh the list after review submission
    fetchReviewableOrders();
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Reviews</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (reviewableOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Reviews</h3>
        <div className="text-center py-8">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No orders to review</p>
          <p className="text-sm text-gray-400">Complete some orders to leave reviews!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Pending Reviews ({reviewableOrders.length})
      </h3>
      
      <div className="space-y-4">
        {reviewableOrders.map((order) => (
          <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <Package className="h-4 w-4 text-emerald-500 mr-2" />
                  <h4 className="font-medium text-gray-900">{order.gigTitle || 'Service Order'}</h4>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span>Package: {order.packageName}</span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Delivered: {orderService.formatDate(order.deliveryDate)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mt-1">
                  Seller: {order.sellerName}
                </p>
              </div>
              
              <button
                onClick={() => handleReviewClick(order)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
              >
                <Star className="h-4 w-4" />
                <span>Leave Review</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {selectedOrder && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedOrder(null);
          }}
          orderId={selectedOrder.id}
          gigTitle={selectedOrder.gigTitle || 'Service Order'}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default ReviewableOrders;