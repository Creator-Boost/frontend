import React, { useState, useEffect } from 'react';
import { Calendar, Search, AlertTriangle, CheckCircle, Clock, Users, ChevronRight } from 'lucide-react';
import { adminDisputeService } from '../services/adminDisputeService';
import { adminUserService } from '../services/adminUserService';
import { OrderWithDisputes } from '../types/dispute';

const Disputes: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'not-resolved' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ordersWithDisputes, setOrdersWithDisputes] = useState<OrderWithDisputes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    fetchOrdersWithDisputes();
  }, []);

  const fetchOrdersWithDisputes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all orders with disputes
      const orders = await adminDisputeService.getOrdersWithDisputes();
      setOrdersWithDisputes(orders);

      // Fetch user names for buyers and sellers
      const userIds = [...new Set([
        ...orders.map(order => order.buyerId),
        ...orders.map(order => order.sellerId)
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
      setError(err instanceof Error ? err.message : 'Failed to fetch disputes');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId: string) => {
    try {
      await adminDisputeService.updateDisputeStatus(disputeId, true);
      
      // Refresh data
      await fetchOrdersWithDisputes();
      alert('Dispute marked as resolved successfully!');
    } catch (err) {
      console.error('Error resolving dispute:', err);
      alert('Failed to resolve dispute');
    }
  };

  const handleReopenDispute = async (disputeId: string) => {
    try {
      await adminDisputeService.updateDisputeStatus(disputeId, false);
      
      // Refresh data
      await fetchOrdersWithDisputes();
      alert('Dispute reopened successfully!');
    } catch (err) {
      console.error('Error reopening dispute:', err);
      alert('Failed to reopen dispute');
    }
  };

  // Flatten disputes with order info for filtering
  const allDisputesWithOrders = ordersWithDisputes.flatMap(order => 
    order.disputes.map(dispute => ({
      ...dispute,
      order,
      priority: adminDisputeService.getDisputePriority(order, dispute)
    }))
  );

  const filteredDisputes = allDisputesWithOrders.filter(disputeData => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'resolved' && disputeData.resolved) ||
      (filterStatus === 'not-resolved' && !disputeData.resolved);
    
    const matchesSearch = 
      disputeData.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disputeData.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disputeData.order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userNames[disputeData.order.buyerId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userNames[disputeData.order.sellerId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (disputeData.order.gigTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (resolved: boolean) => {
    return resolved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading disputes...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Disputes Management</h1>
        <p className="text-gray-600 mt-1">Manage and resolve customer disputes</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Disputes' },
              { key: 'not-resolved', label: 'Not Resolved' },
              { key: 'resolved', label: 'Resolved' }
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setFilterStatus(status.key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search disputes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
            <p className="text-gray-600">No disputes match your current filters.</p>
          </div>
        ) : (
          filteredDisputes.map((disputeData) => (
            <div key={disputeData.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-900">{disputeData.title}</h3>
                  <div className="flex space-x-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(disputeData.resolved || false)}`}>
                      {disputeData.resolved ? 'Resolved' : 'Not Resolved'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(disputeData.priority)}`}>
                      {disputeData.priority} priority
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Buyer:</span>
                    <span>{userNames[disputeData.order.buyerId] || 'Unknown User'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Seller:</span>
                    <span>{userNames[disputeData.order.sellerId] || 'Unknown User'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                  <div><span className="font-medium">Order ID:</span> {disputeData.order.id}</div>
                  <div><span className="font-medium">Service:</span> {disputeData.order.gigTitle}</div>
                  <div><span className="font-medium">Amount:</span> ${disputeData.order.amount}</div>
                  <div><span className="font-medium">Submitted:</span> {new Date(disputeData.createdDate).toLocaleDateString()}</div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-600">{disputeData.description}</p>
                </div>

                <div className="flex justify-end space-x-3">
                  {!disputeData.resolved && (
                    <button
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      onClick={() => handleResolveDispute(disputeData.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Resolved
                    </button>
                  )}
                  
                  {disputeData.resolved && (
                    <button
                      className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      onClick={() => handleReopenDispute(disputeData.id)}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Reopen Dispute
                    </button>
                  )}
                  
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Disputes</p>
              <p className="text-2xl font-bold text-gray-900">{allDisputesWithOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Not Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {allDisputesWithOrders.filter(d => !d.resolved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">
                {allDisputesWithOrders.filter(d => d.resolved).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {allDisputesWithOrders.filter(d => d.priority === 'high').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disputes;