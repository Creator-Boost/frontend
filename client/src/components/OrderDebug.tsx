import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { useAuthStore } from '../context/store/authStore';

const OrderDebug: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.userId) return;
      
      try {
        // Try both methods
        console.log('Fetching orders for user:', user.userId);
        
        const allOrders = await orderService.getAllOrders();
        console.log('All orders:', allOrders);
        
        const sellerOrders = allOrders.filter(order => order.sellerId === user.userId);
        console.log('Seller orders:', sellerOrders);
        
        setOrders(sellerOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.userId]);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Order Debug Info</h3>
      <div className="space-y-4">
        <p><strong>Total orders for this seller:</strong> {orders.length}</p>
        <p><strong>User ID:</strong> {user?.userId}</p>
        
        {orders.map((order, index) => (
          <div key={order.id} className="border p-4 rounded">
            <h4 className="font-medium">Order {index + 1} (ID: {order.id})</h4>
            <div className="text-sm space-y-1">
              <p><strong>Seller ID:</strong> {order.sellerId}</p>
              <p><strong>Buyer ID:</strong> {order.buyerId}</p>
              <p><strong>Buyer Name:</strong> {order.buyerName}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Has Review:</strong> {order.review ? 'Yes' : 'No'}</p>
              {order.review && (
                <div className="ml-4 p-2 bg-gray-100 rounded">
                  <p><strong>Review Rating:</strong> {order.review.rating}</p>
                  <p><strong>Review Text:</strong> {order.review.reviewText}</p>
                  <p><strong>Review Created:</strong> {order.review.createdAt}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDebug;