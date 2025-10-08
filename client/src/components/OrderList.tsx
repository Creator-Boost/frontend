import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Package, 
  User, 
  Calendar, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Download,
  MessageCircle,
  X,
  FileText
} from 'lucide-react';
import { orderService, type Order, ORDER_STATUS } from '../services/orderService';
import { useAuthStore } from '../context/store/authStore';

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
  const [uploadingFiles, setUploadingFiles] = useState<string | null>(null);

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

  const handleFileUpload = async (orderId: string, files: FileList) => {
    setUploadingFiles(orderId);
    try {
      await orderService.addDeliveryFiles(orderId, files);
      await fetchOrders();
      alert('Delivery files uploaded successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setUploadingFiles(null);
    }
  };

  const canUpdateStatus = (order: Order): boolean => {
    return user?.userId === order.sellerId;
  };

  const canUploadFiles = (order: Order): boolean => {
    return user?.userId === order.sellerId;
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder || !showOrderDetails) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
            <button
              onClick={() => setShowOrderDetails(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Order ID:</span> {selectedOrder.id}</div>
                  <div><span className="font-medium">Package:</span> {selectedOrder.packageName}</div>
                  <div><span className="font-medium">Amount:</span> ${selectedOrder.amount}</div>
                  <div><span className="font-medium">Order Date:</span> {orderService.formatDate(selectedOrder.orderDate)}</div>
                  <div><span className="font-medium">Delivery Date:</span> {orderService.formatDate(selectedOrder.deliveryDate)}</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{ORDER_STATUS[selectedOrder.status]}</span>
                    <span>{orderService.getStatusPercentage(selectedOrder.status)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${orderService.getStatusPercentage(selectedOrder.status)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-700">{selectedOrder.requirements}</p>
              </div>
            </div>

            {/* Delivery Files */}
            {selectedOrder.deliveryFiles && selectedOrder.deliveryFiles.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Delivery Files</h3>
                <div className="space-y-2">
                  {selectedOrder.deliveryFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                      <span className="text-sm text-gray-700">{file}</span>
                      <button className="text-blue-600 hover:text-blue-800">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="border-t pt-4">
              <div className="flex gap-3">
                {canUpdateStatus(selectedOrder) && (
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusUpdate(selectedOrder.id, e.target.value as keyof typeof ORDER_STATUS)}
                    disabled={updatingStatus === selectedOrder.id}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    {Object.entries(ORDER_STATUS).map(([key, value]) => (
                      <option key={key} value={key}>{value}</option>
                    ))}
                  </select>
                )}
                
                {canUploadFiles(selectedOrder) && (
                  <label className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 cursor-pointer text-sm flex items-center gap-2">
                    <Upload size={16} />
                    Upload Files
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => e.target.files && handleFileUpload(selectedOrder.id, e.target.files)}
                      disabled={uploadingFiles === selectedOrder.id}
                    />
                  </label>
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
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
        <AlertCircle size={20} />
        <div>
          <div className="font-medium">Error loading orders</div>
          <div className="text-sm">{error}</div>
        </div>
        <button
          onClick={fetchOrders}
          className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {viewType === 'buyer' ? 'My Orders' : viewType === 'seller' ? 'Orders to Fulfill' : 'All Orders'}
        </h2>
        <button
          onClick={fetchOrders}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
        >
          Refresh
        </button>
      </div>

      {orders.map((order) => {
        const statusDisplay = orderService.getStatusDisplay(order.status);
        const isBuyer = user?.userId === order.buyerId;
        const isSeller = user?.userId === order.sellerId;

        return (
          <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {order.gigTitle}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{order.gigDescription}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
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
                    <span>{isBuyer ? 'Your Order' : isSeller ? 'Your Service' : 'Order'}</span>
                  </div>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-3">
                  {isBuyer && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Buyer
                    </span>
                  )}
                  {isSeller && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Seller
                    </span>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  ${order.amount}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusDisplay.color}`}>
                  {statusDisplay.label}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{statusDisplay.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${statusDisplay.percentage}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock size={16} />
                <span>Ordered: {orderService.formatDate(order.orderDate)}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowOrderDetails(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                >
                  <Eye size={16} />
                  View Details
                </button>
                
                {isSeller && (
                  <button
                    onClick={() => handleStatusUpdate(order.id, 'IN_PROGRESS')}
                    disabled={updatingStatus === order.id || order.status !== 'NOT_STARTED'}
                    className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 disabled:opacity-50"
                  >
                    {updatingStatus === order.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    Start Work
                  </button>
                )}

                <button className="text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>

            {/* Requirements Preview */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
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