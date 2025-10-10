import React, { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, Calendar, RefreshCw, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { adminOrderService, type Order } from '../services/orderService';
import { adminUserService } from '../services/adminUserService';

const Bookings: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'PAID' | 'REFUNDED'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all orders
      const allOrders = await adminOrderService.getAllOrders();
      
      // Add default admin status if not present
      const ordersWithAdminStatus = allOrders.map(order => ({
        ...order,
        adminStatus: order.adminStatus || 'PENDING' as 'PENDING' | 'PAID' | 'REFUNDED'
      }));
      
      setOrders(ordersWithAdminStatus);

      // Fetch user names for buyers and sellers
      const userIds = [...new Set([
        ...ordersWithAdminStatus.map((order: Order) => order.buyerId),
        ...ordersWithAdminStatus.map((order: Order) => order.sellerId)
      ])];
      
      const userNamePromises = userIds.map(async (userId) => {
        try {
          const userProfile = await adminUserService.getUserProfile(userId);
          return { [userId]: userProfile.name };
        } catch (error) {
          return { [userId]: 'Unknown User' };
        }
      });

      const userNameResults = await Promise.all(userNamePromises);
      const userNamesMap = userNameResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setUserNames(userNamesMap);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminStatusUpdate = async (orderId: string, newStatus: 'PENDING' | 'PAID' | 'REFUNDED') => {
    try {
      await adminOrderService.updateAdminStatus(orderId, newStatus);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId ? { ...order, adminStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating admin status:', err);
      alert('Failed to update admin status');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.adminStatus === filterStatus;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userNames[order.buyerId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userNames[order.sellerId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.gigTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getOrderStatusColor = (status: string) => {
    const statusInfo = adminOrderService.getStatusDisplay(status);
    return statusInfo.color;
  };

  // Calculate summary stats
  const totalRevenue = orders.filter(o => o.adminStatus === 'PAID').reduce((sum, order) => sum + order.amount, 0);
  const pendingPayments = orders.filter(o => o.adminStatus === 'PENDING').reduce((sum, order) => sum + order.amount, 0);
  const refundsIssued = orders.filter(o => o.adminStatus === 'REFUNDED').reduce((sum, order) => sum + order.amount, 0);
  const commission = totalRevenue * 0.1; // Assuming 10% commission

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">View and manage all transactions</p>
        </div>
        
        <div className="relative">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="py-2 pl-10 pr-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-2">
            {(['all', 'PENDING', 'PAID', 'REFUNDED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Order ID</th>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Client</th>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Provider</th>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Service</th>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Amount</th>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Order Status</th>
                <th className="px-6 py-3 font-medium text-left text-gray-900">Admin Status</th>
                <th className="px-6 py-3 font-medium text-center text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-blue-600">#{order.id.slice(0, 8)}...</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{userNames[order.buyerId] || 'Loading...'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{userNames[order.sellerId] || 'Loading...'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{order.gigTitle || order.packageName}</div>
                    <div className="text-xs text-gray-500">{order.packageName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">${order.amount}</div>
                    <div className="text-xs text-gray-500">Commission: ${(order.amount * 0.1).toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                      {adminOrderService.getStatusDisplay(order.status).label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${adminOrderService.getAdminStatusDisplay(order.adminStatus!).color}`}>
                        {adminOrderService.getAdminStatusDisplay(order.adminStatus!).label}
                      </span>
                      <select
                        value={order.adminStatus}
                        onChange={(e) => handleAdminStatusUpdate(order.id, e.target.value as 'PENDING' | 'PAID' | 'REFUNDED')}
                        className="text-xs border border-gray-200 rounded px-1 py-0.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="REFUNDED">Refunded</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-1">
                      {order.adminStatus === 'PAID' && (
                        <button
                          onClick={() => handleAdminStatusUpdate(order.id, 'REFUNDED')}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Issue Refund"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                      {order.adminStatus === 'PENDING' && (
                        <button
                          onClick={() => handleAdminStatusUpdate(order.id, 'PAID')}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as Paid"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div className="py-12 text-center">
          <p className="text-gray-500">No bookings found matching your criteria.</p>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="font-bold text-gray-900">${totalRevenue.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Commission Earned</div>
              <div className="font-bold text-gray-900">${commission.toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="text-sm text-gray-600">Pending Payments</div>
          <div className="font-bold text-yellow-600">${pendingPayments.toLocaleString()}</div>
        </div>
        <div className="p-4 bg-white border border-gray-200 shadow-sm rounded-xl">
          <div className="text-sm text-gray-600">Refunds Issued</div>
          <div className="font-bold text-red-600">${refundsIssued.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;