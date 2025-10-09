import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Package, 
  User, 
  Calendar, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  MessageCircle,
  X,
  FileText
} from 'lucide-react';
import { orderService, type Order, ORDER_STATUS } from '../services/orderService';
import { useAuthStore } from '../context/store/authStore';
import FileUploadManager from './FileUploadManager';

interface OrderListProps {
  viewType?: 'buyer' | 'seller' | 'all';
  userId?: string;
}

export const OrderList: React.FC<OrderListProps> = ({ viewType = 'all', userId }) => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [orderFiles, setOrderFiles] = useState<{url: string, filename: string}[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [viewType, userId]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      let orderData: Order[];
      
      if (viewType === 'buyer' && userId) {
        orderData = await orderService.getOrdersByBuyer(userId);
      } else if (viewType === 'seller' && userId) {
        orderData = await orderService.getOrdersBySeller(userId);
      } else {
        orderData = await orderService.getAllOrders();
      }
      
      setOrders(orderData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: keyof typeof ORDER_STATUS) => {
    setUpdatingStatus(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh orders
      await fetchOrders();
      alert('Order status updated successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const canUpdateStatus = (order: Order): boolean => {
    return user?.userId === order.sellerId;
  };

  const parseOrderFiles = (order: Order): {url: string, filename: string}[] => {
    const files: {url: string, filename: string}[] = [];
    
    if (order.deliveredFiles) {
      const fileUrls = orderService.parseDeliveredFiles(order.deliveredFiles);
      fileUrls.forEach(url => {
        files.push({
          url: url,
          filename: orderService.getFilenameFromUrl(url)
        });
      });
    }
    
    return files;
  };

  const loadOrderFiles = async (order: Order) => {
    try {
      // Fetch fresh order data to get latest deliveredFiles
      const freshOrder = await orderService.getOrderById(order.id);
      const files = parseOrderFiles(freshOrder);
      setOrderFiles(files);
      
      // Also update the selected order to have latest data
      setSelectedOrder(freshOrder);
    } catch (error) {
      console.error('Error loading order files:', error);
      // Fallback to current order data
      const files = parseOrderFiles(order);
      setOrderFiles(files);
    }
  };

  const handleFilesRefresh = async () => {
    if (selectedOrder) {
      await loadOrderFiles(selectedOrder);
    }
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder || !showOrderDetails) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={() => setShowOrderDetails(false)}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Order ID:</span> {selectedOrder.id}</div>
                  <div><span className="font-medium">Buyer:</span> {selectedOrder.buyerName}</div>
                  <div><span className="font-medium">Seller:</span> {selectedOrder.sellerName}</div>
                  <div><span className="font-medium">Package:</span> {selectedOrder.packageName}</div>
                  <div><span className="font-medium">Amount:</span> ${selectedOrder.amount}</div>
                  <div><span className="font-medium">Order Date:</span> {orderService.formatDate(selectedOrder.orderDate)}</div>
                  <div><span className="font-medium">Delivery Date:</span> {orderService.formatDate(selectedOrder.deliveryDate)}</div>
                </div>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{orderService.getStatusDisplay(selectedOrder.status).label}</span>
                    <span>{orderService.getStatusPercentage(selectedOrder.status)}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div 
                      className="h-3 transition-all duration-300 bg-blue-600 rounded-full"
                      style={{ width: `${orderService.getStatusPercentage(selectedOrder.status)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Requirements</h3>
              <div className="p-4 rounded-lg bg-gray-50">
                <p className="text-sm text-gray-700">{selectedOrder.requirements}</p>
              </div>
            </div>

            {/* File Upload Manager */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-900">Order Files</h3>
              <FileUploadManager
                orderId={selectedOrder.id}
                files={orderFiles}
                userRole={user?.userId === selectedOrder.buyerId ? 'client' : 'expert'}
                onFilesUpdate={handleFilesRefresh}
                className="p-4 rounded-lg bg-gray-50"
              />
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <div className="flex gap-3">
                {canUpdateStatus(selectedOrder) && (
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as keyof typeof ORDER_STATUS)}
                    disabled={updatingStatus === selectedOrder.id}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md"
                  >
                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
        <AlertCircle size={20} />
        <div>
          <div className="font-medium">Error loading orders</div>
          <div className="text-sm">{error}</div>
        </div>
        <button
          onClick={fetchOrders}
          className="px-3 py-1 ml-auto text-sm text-white bg-red-600 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">No orders found</h3>
        <p className="text-gray-500">
          {viewType === 'buyer' 
            ? "You haven't placed any orders yet." 
            : viewType === 'seller'
            ? "You don't have any orders to fulfill yet."
            : "No orders available."
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {viewType === 'buyer' ? 'My Orders' : viewType === 'seller' ? 'Orders to Fulfill' : 'All Orders'}
        </h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Refresh
        </button>
      </div>

      {orders.map((order) => {
        const statusDisplay = orderService.getStatusDisplay(order.status);
        const isBuyer = user?.userId === order.buyerId;
        const isSeller = user?.userId === order.sellerId;

        return (
          <div key={order.id} className="p-6 transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">
                  {order.gigTitle || order.requirements.substring(0, 60) + (order.requirements.length > 60 ? '...' : '')}
                </h3>
                <p className="mb-2 text-sm text-gray-600 line-clamp-2">{order.gigDescription || `Package: ${order.packageName}`}</p>
                
                <div className="flex items-center gap-4 mb-2 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Package size={16} />
                    <span>{order.packageName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>Due: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User size={16} />
                    <span>{isBuyer ? `Seller: ${order.sellerName}` : isSeller ? `Client: ${order.buyerName}` : 'Order'}</span>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-3">
                  {isBuyer && (
                    <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                      Buyer
                    </span>
                  )}
                  {isSeller && (
                    <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                      Seller
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="mb-2 text-2xl font-bold text-gray-900">
                  ${order.amount}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                  {statusDisplay.label}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between mb-1 text-sm text-gray-600">
                <span>Progress</span>
                <span>{statusDisplay.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div 
                  className="h-2 transition-all duration-300 bg-blue-600 rounded-full"
                  style={{ width: `${statusDisplay.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock size={16} />
                <span>Ordered: {orderService.formatDate(order.orderDate)}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                    await loadOrderFiles(order);
                  }}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Eye size={16} />
                  View Details
                </button>
                
                {isSeller && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'IN_PROGRESS')}
                    disabled={updatingStatus === order.id || order.status !== 'NOT_STARTED'}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 disabled:opacity-50"
                  >
                    {updatingStatus === order.id ? (
                      <div className="w-4 h-4 border-b-2 border-green-600 rounded-full animate-spin"></div>
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Start Work
                  </button>
                )}

                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>

            {/* Requirements Preview */}
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="flex items-center gap-1 mb-2 text-sm font-medium text-gray-900">
                <FileText size={16} />
                Requirements:
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">{order.requirements}</p>
            </div>
          </div>
        );
      })}

      <OrderDetailsModal />
    </div>
  );
};

export default OrderList;