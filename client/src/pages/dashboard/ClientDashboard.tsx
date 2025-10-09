import React, { useState, useEffect } from 'react';
import { Plus, Search, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import OrderList from '../../components/OrderList';
import UserAvatar from '../../components/UserAvatar';
import { useAuthStore } from '../../context/store/authStore';
import { orderService, type Order } from '../../services/orderService';
import { userService, type UserProfile } from '../../services/userService';

const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [savedExperts, setSavedExperts] = useState<{id: string, name: string, ordersCount: number, totalSpent: number, imageUrl?: string}[]>([]);
  const [expertProfiles, setExpertProfiles] = useState<Map<string, UserProfile>>(new Map());
  const { user } = useAuthStore();

  // Fetch all orders for the current buyer
  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!user?.userId) return;
      
      setLoadingOrders(true);
      try {
        const orders = await orderService.getOrdersByBuyer(user.userId);
        setAllOrders(orders);
        
        // Get orders that are not delivered (active orders)
        const active = orders.filter(order => order.status !== 'DELIVERED');
        setActiveOrders(active.slice(0, 3)); // Show only 3 in overview
        
        // Process saved experts (unique sellers from orders)
        const expertsMap = new Map();
        orders.forEach(order => {
          if (order.sellerId && order.sellerName) {
            if (expertsMap.has(order.sellerId)) {
              const expert = expertsMap.get(order.sellerId);
              expert.ordersCount += 1;
              expert.totalSpent += order.amount;
            } else {
              expertsMap.set(order.sellerId, {
                id: order.sellerId,
                name: order.sellerName,
                ordersCount: 1,
                totalSpent: order.amount
              });
            }
          }
        });
        
        const experts = Array.from(expertsMap.values());
        setSavedExperts(experts);
        
        // Fetch expert profiles for images
        if (experts.length > 0) {
          try {
            const expertIds = experts.map(expert => expert.id);
            const profiles = await userService.getUserProfiles(expertIds);
            const profilesMap = new Map();
            profiles.forEach(profile => {
              profilesMap.set(profile.userId, profile);
            });
            setExpertProfiles(profilesMap);
            
            // Update experts with image URLs
            const expertsWithImages = experts.map(expert => ({
              ...expert,
              imageUrl: profilesMap.get(expert.id)?.imageUrl || null
            }));
            setSavedExperts(expertsWithImages);
          } catch (error) {
            console.error('Error fetching expert profiles:', error);
            // Continue without profile images
          }
        }
        
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchAllOrders();
  }, [user?.userId]);

  // Calculate real-time stats from orders data
  const activeOrdersCount = allOrders.filter(order => order.status !== 'DELIVERED').length;
  const completedOrdersCount = allOrders.filter(order => order.status === 'DELIVERED').length;
  const totalSpent = allOrders.reduce((sum, order) => sum + order.amount, 0);
  const savedExpertsCount = savedExperts.length;

  const stats = [
    { label: 'Active Orders', value: activeOrdersCount.toString(), icon: Clock, color: 'text-blue-600' },
    { label: 'Completed Orders', value: completedOrdersCount.toString(), icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: Plus, color: 'text-purple-600' },
    { label: 'Saved Experts', value: savedExpertsCount.toString(), icon: Search, color: 'text-yellow-600' }
  ];

  const workRequests = [
    {
      id: '1',
      title: 'Need YouTube thumbnail designer',
      description: 'Looking for someone to create eye-catching thumbnails for my tech channel',
      budget: '$50-$100',
      proposals: 8,
      posted: '2 days ago',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Social media manager for small business',
      description: 'Need help managing Instagram and Facebook for my local restaurant',
      budget: '$300-$500',
      proposals: 15,
      posted: '5 days ago',
      status: 'Active'
    },
    {
      id: '3',
      title: 'LinkedIn content writer needed',
      description: 'Looking for professional content writer for B2B LinkedIn posts',
      budget: '$200-$400',
      proposals: 12,
      posted: '1 week ago',
      status: 'Closed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="mt-2 text-gray-600">Track your orders and manage your projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="p-6 mb-8 bg-white rounded-lg shadow-sm">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-6 py-3 text-white rounded-lg bg-emerald-500 hover:bg-emerald-600">
              <Search className="w-5 h-5" />
              Find Experts
            </button>
            <button className="flex items-center gap-2 px-6 py-3 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
              <Plus className="w-5 h-5" />
              Post Work Request
            </button>
            <button className="flex items-center gap-2 px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MessageCircle className="w-5 h-5" />
              Messages
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex px-6 space-x-8">
              {['overview', 'active orders', 'work requests', 'order history', 'saved experts'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Orders Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Active Orders</h4>
                    <p className="text-2xl font-bold text-blue-900">{activeOrdersCount}</p>
                    <p className="text-xs text-blue-600">
                      {allOrders.filter(order => order.status === 'NEW').length} New, {' '}
                      {allOrders.filter(order => order.status === 'IN_PROGRESS').length} In Progress
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Completed Orders</h4>
                    <p className="text-2xl font-bold text-green-900">{completedOrdersCount}</p>
                    <p className="text-xs text-green-600">
                      Average: ${completedOrdersCount > 0 ? (allOrders.filter(order => order.status === 'DELIVERED').reduce((sum, order) => sum + order.amount, 0) / completedOrdersCount).toFixed(2) : '0'}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">Total Investment</h4>
                    <p className="text-2xl font-bold text-purple-900">${totalSpent.toFixed(2)}</p>
                    <p className="text-xs text-purple-600">
                      Across {savedExpertsCount} expert{savedExpertsCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Active Orders</h3>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-600">Loading active orders...</span>
                    </div>
                  ) : activeOrders.length > 0 ? (
                    <div className="space-y-3">
                      {activeOrders.map((order) => {
                        // Truncate requirements to display as title (first 50 characters)
                        const requirementsTitle = order.requirements.length > 50 
                          ? order.requirements.substring(0, 50) + '...' 
                          : order.requirements;
                        
                        return (
                          <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex items-center">
                              <UserAvatar 
                                imageUrl={expertProfiles.get(order.sellerId)?.imageUrl}
                                name={order.sellerName}
                                size="md"
                                className="mr-3"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{requirementsTitle}</p>
                                <p className="text-sm text-gray-600">Expert: {order.sellerName}</p>
                                <p className="text-xs text-gray-500">
                                  Due: {new Date(order.deliveryDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">${order.amount}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {allOrders.filter(order => order.status !== 'DELIVERED').length > 3 && (
                        <div className="text-center pt-4">
                          <button 
                            onClick={() => setActiveTab('active orders')}
                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                          >
                            View all {allOrders.filter(order => order.status !== 'DELIVERED').length} active orders →
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p>No active orders found</p>
                      <p className="text-sm">All your orders are completed!</p>
                    </div>
                  )}
                </div>

                {/* Top Experts */}
                {savedExperts.length > 0 && (
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">Your Top Experts</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {savedExperts
                        .sort((a, b) => b.totalSpent - a.totalSpent)
                        .slice(0, 3)
                        .map((expert) => (
                          <div key={expert.id} className="bg-white border rounded-lg p-4">
                            <div className="flex items-center mb-3">
                              <UserAvatar 
                                imageUrl={expert.imageUrl}
                                name={expert.name}
                                size="sm"
                                className="mr-3"
                              />
                              <div>
                                <h4 className="font-medium text-gray-900 text-sm">{expert.name}</h4>
                                <p className="text-xs text-gray-600">{expert.ordersCount} orders</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Total spent: <span className="font-medium text-emerald-600">${expert.totalSpent.toFixed(2)}</span>
                            </p>
                          </div>
                        ))}
                    </div>
                    <div className="text-center pt-4">
                      <button 
                        onClick={() => setActiveTab('saved experts')}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                      >
                        View all {savedExperts.length} experts →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'active orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Active Orders</h3>
                  <p className="text-sm text-gray-600">
                    {allOrders.filter(order => order.status !== 'DELIVERED').length} active orders
                  </p>
                </div>
                
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading active orders...</span>
                  </div>
                ) : allOrders.filter(order => order.status !== 'DELIVERED').length > 0 ? (
                  <div className="space-y-4">
                    {allOrders
                      .filter(order => order.status !== 'DELIVERED')
                      .map((order) => (
                        <div key={order.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start">
                              <UserAvatar 
                                imageUrl={expertProfiles.get(order.sellerId)?.imageUrl}
                                name={order.sellerName}
                                size="md"
                                className="mr-4"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">
                                  {order.gigTitle || 'Service Order'}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">Expert: {order.sellerName}</p>
                                <p className="text-sm text-gray-700 mb-3">{order.requirements}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>Order Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                                  <span>Due: {new Date(order.deliveryDate).toLocaleDateString()}</span>
                                  <span>Package: {order.packageName}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-gray-900 mb-2">${order.amount}</p>
                              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                order.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'NEW' ? 'bg-yellow-100 text-yellow-800' :
                                order.status === 'UNDER_TESTING' ? 'bg-orange-100 text-orange-800' :
                                order.status === 'PENDING_REVIEW' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="flex items-center gap-2">
                              {order.status === 'NEW' && (
                                <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                                  ⏳ Waiting to start
                                </span>
                              )}
                              {order.status === 'IN_PROGRESS' && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  🔄 Work in progress
                                </span>
                              )}
                              {order.status === 'UNDER_TESTING' && (
                                <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                                  🔍 Under review
                                </span>
                              )}
                              {order.status === 'PENDING_REVIEW' && (
                                <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                  📋 Pending your review
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded hover:bg-gray-50">
                                View Details
                              </button>
                              <button className="px-3 py-1 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600">
                                Contact Expert
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-600 mb-6">
                      You don't have any active orders right now. All your orders are completed.
                    </p>
                    <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      Find New Experts
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'work requests' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Work Requests</h3>
                  <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-emerald-500 hover:bg-emerald-600">
                    <Plus className="w-4 h-4" />
                    Post New Request
                  </button>
                </div>
                
                <div className="space-y-4">
                  {workRequests.map((request) => (
                    <div key={request.id} className="p-6 bg-white border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="mt-1 text-gray-600">{request.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          request.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex gap-4">
                          <span>Budget: {request.budget}</span>
                          <span>{request.proposals} proposals</span>
                          <span>Posted {request.posted}</span>
                        </div>
                        <button className="text-emerald-600 hover:text-emerald-800">
                          View Proposals
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'order history' && (
              <div>
                <OrderList viewType="buyer" userId={user?.userId} />
              </div>
            )}

            {activeTab === 'saved experts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Saved Experts</h3>
                  <p className="text-sm text-gray-600">{savedExperts.length} experts found</p>
                </div>
                
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-b-2 border-emerald-600 rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading experts...</span>
                  </div>
                ) : savedExperts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedExperts.map((expert) => (
                      <div key={expert.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-4">
                          <UserAvatar 
                            imageUrl={expert.imageUrl}
                            name={expert.name}
                            size="md"
                            className="mr-4"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{expert.name}</h4>
                            <p className="text-sm text-gray-600">Expert Seller</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Orders Completed:</span>
                            <span className="font-medium text-gray-900">{expert.ordersCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Total Spent:</span>
                            <span className="font-medium text-emerald-600">${expert.totalSpent.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button className="flex-1 bg-emerald-500 text-white px-3 py-2 rounded text-sm hover:bg-emerald-600 transition-colors">
                            Contact Expert
                          </button>
                          <button className="flex-1 border border-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-50 transition-colors">
                            View Profile
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Saved Experts Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start working with experts to build your network of trusted sellers.
                    </p>
                    <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition-colors">
                      Find Experts
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;