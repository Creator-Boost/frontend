import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, DollarSign, TrendingUp, Users, Star, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';
import CreateGigForm from '../../components/CreateGigForm';
import EditGigModal from '../../components/EditGigModal';
import ViewGigModal from '../../components/ViewGigModal';
import EarningsChart, { type EarningsDataPoint } from '../../components/EarningsChart';
import UserAvatar from '../../components/UserAvatar';
import OrderList from '../../components/OrderList';
import { useAuthStore } from '../../context/store/authStore';
import { orderService, type Order } from '../../services/orderService';
import { gigService, type Gig } from '../../services/gigService';
import { userService, type UserProfile } from '../../services/userService';

const ExpertDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateGigModalOpen, setIsCreateGigModalOpen] = useState(false);
  const [isEditGigModalOpen, setIsEditGigModalOpen] = useState(false);
  const [isViewGigModalOpen, setIsViewGigModalOpen] = useState(false);
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [myGigs, setMyGigs] = useState<Gig[]>([]);
  const [loadingGigs, setLoadingGigs] = useState(false);
  const [earningsData, setEarningsData] = useState<EarningsDataPoint[]>([]);
  const [earningsPeriod, setEarningsPeriod] = useState<'7days' | '30days' | '90days' | 'all'>('30days');
  const [buyerProfiles, setBuyerProfiles] = useState<Map<string, UserProfile>>(new Map());
  const { user } = useAuthStore();

  // Fetch gigs for the current seller
  useEffect(() => {
    const fetchMyGigs = async () => {
      if (!user?.userId || activeTab !== 'gigs') return;
      
      setLoadingGigs(true);
      try {
        const gigs = await gigService.getGigsBySeller(user.userId);
        setMyGigs(gigs);
      } catch (error) {
        console.error('Error fetching gigs:', error);
        setMyGigs([]);
      } finally {
        setLoadingGigs(false);
      }
    };

    fetchMyGigs();
  }, [activeTab, user?.userId]);

  // Handler functions for gig actions
  const handleViewGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsViewGigModalOpen(true);
  };

  const handleEditGig = (gig: Gig) => {
    setSelectedGig(gig);
    setIsEditGigModalOpen(true);
  };

  const handleToggleGigStatus = async (gig: Gig) => {
    try {
      const newStatus = gig.status === 'Active' || gig.status === 'ACTIVE' ? 'Paused' : 'Active';
      const updatedGig = await gigService.updateGigStatus(gig.id!, newStatus);
      
      // Update the local state
      setMyGigs(prevGigs => 
        prevGigs.map(g => g.id === gig.id ? updatedGig : g)
      );
    } catch (error) {
      console.error('Error updating gig status:', error);
    }
  };

  const handleGigSaved = (updatedGig: Gig) => {
    setMyGigs(prevGigs => 
      prevGigs.map(g => g.id === updatedGig.id ? updatedGig : g)
    );
  };

  // Fetch all orders for the current seller to calculate stats
  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!user?.userId) return;
      
      setLoadingOrders(true);
      try {
        const orders = await orderService.getOrdersBySeller(user.userId);
        setAllOrders(orders);
        // Get the 3 most recent orders
        const recent = orders.slice(0, 3);
        setRecentOrders(recent);
        
        // Fetch buyer profiles for recent orders
        const buyerIds = [...new Set(recent.map(order => order.buyerId))];
        if (buyerIds.length > 0) {
          const profiles = await userService.getUserProfiles(buyerIds);
          const profileMap = new Map<string, UserProfile>();
          profiles.forEach(profile => {
            profileMap.set(profile.userId, profile);
          });
          setBuyerProfiles(profileMap);
        }
        
        // Process earnings data for chart
        processEarningsData(orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    if (activeTab === 'overview' || activeTab === 'earnings') {
      fetchAllOrders();
    }
  }, [activeTab, user?.userId, earningsPeriod]);

  // Process orders data for earnings chart
  const processEarningsData = (orders: Order[]) => {
    if (!orders.length) {
      setEarningsData([]);
      return;
    }

    // Filter orders based on selected period
    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);
      const daysDiff = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (earningsPeriod) {
        case '7days': return daysDiff <= 7;
        case '30days': return daysDiff <= 30;
        case '90days': return daysDiff <= 90;
        case 'all': return true;
        default: return daysDiff <= 30;
      }
    });

    // Group orders by date and calculate daily earnings
    const earningsByDate: { [key: string]: { amount: number; orders: number } } = {};
    
    filteredOrders.forEach(order => {
      const date = new Date(order.orderDate).toISOString().split('T')[0];
      if (!earningsByDate[date]) {
        earningsByDate[date] = { amount: 0, orders: 0 };
      }
      earningsByDate[date].amount += order.amount;
      earningsByDate[date].orders += 1;
    });

    // Convert to array and sort by date
    const earningsArray: EarningsDataPoint[] = Object.entries(earningsByDate)
      .map(([date, data]) => ({
        date,
        amount: data.amount,
        orders: data.orders
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Fill in missing dates with zero earnings for better visualization
    if (earningsArray.length > 0) {
      const startDate = new Date(earningsArray[0].date);
      const endDate = new Date(earningsArray[earningsArray.length - 1].date);
      const filledData: EarningsDataPoint[] = [];
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const existingData = earningsArray.find(item => item.date === dateStr);
        filledData.push(existingData || { date: dateStr, amount: 0, orders: 0 });
      }
      
      setEarningsData(filledData);
    } else {
      setEarningsData([]);
    }
  };

  // Calculate stats from real order data
  const totalEarnings = allOrders.reduce((sum, order) => sum + order.amount, 0);
  const totalOrdersCount = allOrders.length;
  const deliveredOrders = allOrders.filter(order => order.status === 'DELIVERED');
  const completionRate = totalOrdersCount > 0 ? Math.round((deliveredOrders.length / totalOrdersCount) * 100) : 0;

  const stats = [
    { label: 'Total Earnings', value: `$${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Gigs', value: myGigs.filter(gig => gig.status === 'Active' || gig.status === 'ACTIVE').length.toString(), icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Total Orders', value: totalOrdersCount.toString(), icon: Users, color: 'text-purple-600' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: Star, color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your services and track your performance</p>
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

        {/* Navigation Tabs */}
        <div className="mb-6 bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex px-6 space-x-8">
              {['overview', 'gigs', 'orders', 'earnings', 'messages'].map((tab) => (
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
                {/* Recent Activity */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">Recent Orders</h3>
                  {loadingOrders ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-600">Loading recent orders...</span>
                    </div>
                  ) : recentOrders.length > 0 ? (
                    <div className="space-y-3">
                      {recentOrders.map((order) => {
                        // Truncate requirements to display as title (first 50 characters)
                        const requirementsTitle = order.requirements.length > 50 
                          ? order.requirements.substring(0, 50) + '...' 
                          : order.requirements;
                        
                        const buyerProfile = buyerProfiles.get(order.buyerId);
                        
                        return (
                          <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <UserAvatar 
                                imageUrl={buyerProfile?.imageUrl || null}
                                name={order.buyerName}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{requirementsTitle}</p>
                                <p className="text-sm text-gray-600">Client: {order.buyerName}</p>
                                <p className="text-sm text-gray-500">Due: {new Date(order.deliveryDate).toLocaleDateString()}</p>
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
                    </div>
                  ) : (
                    <div className="py-6 text-center text-gray-500">
                      No recent orders found
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gigs' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900">My Gigs</h3>
                  <button 
                    onClick={() => setIsCreateGigModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-white rounded-lg bg-emerald-500 hover:bg-emerald-600"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Gig
                  </button>
                </div>
                
                {loadingGigs ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading your gigs...</span>
                  </div>
                ) : myGigs.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {myGigs.map((gig) => (
                      <div key={gig.id} className="overflow-hidden bg-white border rounded-lg">
                        {gig.images && gig.images.length > 0 ? (
                          <img
                            src={gig.images.find(img => img.isPrimary)?.url || gig.images[0]?.url}
                            alt={gig.title}
                            className="object-cover w-full h-48"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-48 bg-gray-200">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="mb-2 font-medium text-gray-900 line-clamp-2">{gig.title}</h4>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              ${gig.packages && gig.packages.length > 0 ? gig.packages[0].price : 'N/A'}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                gig.status === 'Active' || gig.status === 'ACTIVE' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {gig.status === 'ACTIVE' ? 'Active' : gig.status === 'INACTIVE' ? 'Paused' : gig.status}
                              </span>
                              <button
                                onClick={() => handleToggleGigStatus(gig)}
                                className="p-1 rounded hover:bg-gray-100"
                                title={`Switch to ${gig.status === 'Active' || gig.status === 'ACTIVE' ? 'Paused' : 'Active'}`}
                              >
                                {gig.status === 'Active' || gig.status === 'ACTIVE' ? (
                                  <ToggleRight className="w-5 h-5 text-green-600" />
                                ) : (
                                  <ToggleLeft className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between mb-4 text-sm text-gray-600">
                            <span>{gig.platform}</span>
                            <span className="flex items-center">
                              <Star className="w-4 h-4 mr-1 text-yellow-400" />
                              N/A
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleViewGig(gig)}
                              className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            <button 
                              onClick={() => handleEditGig(gig)}
                              className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                            >
                              <Edit className="w-4 h-4" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <p>No gigs found. Create your first gig to get started!</p>
                    <button 
                      onClick={() => setIsCreateGigModalOpen(true)}
                      className="px-6 py-2 mt-4 text-white rounded-lg bg-emerald-500 hover:bg-emerald-600"
                    >
                      Create Your First Gig
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <OrderList viewType="seller" userId={user?.userId} />
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Earnings Overview</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <select
                      value={earningsPeriod}
                      onChange={(e) => setEarningsPeriod(e.target.value as any)}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                      <option value="90days">Last 90 Days</option>
                      <option value="all">All Time</option>
                    </select>
                  </div>
                </div>
                
                {loadingOrders ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-b-2 border-emerald-600 rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Loading earnings data...</span>
                  </div>
                ) : (
                  <EarningsChart data={earningsData} period={earningsPeriod} />
                )}

                {/* Recent Earnings Breakdown */}
                {earningsData.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Earnings Breakdown</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-emerald-50 rounded-lg p-4">
                        <p className="text-sm text-emerald-600 font-medium">This Period</p>
                        <p className="text-2xl font-bold text-emerald-800">
                          ${earningsData.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                        </p>
                        <p className="text-xs text-emerald-600">
                          {earningsData.reduce((sum, d) => sum + d.orders, 0)} orders
                        </p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 font-medium">Average per Day</p>
                        <p className="text-2xl font-bold text-blue-800">
                          ${earningsData.length > 0 ? (earningsData.reduce((sum, d) => sum + d.amount, 0) / earningsData.length).toFixed(2) : '0.00'}
                        </p>
                        <p className="text-xs text-blue-600">
                          {earningsData.length > 0 ? (earningsData.reduce((sum, d) => sum + d.orders, 0) / earningsData.length).toFixed(1) : '0'} orders/day
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-purple-600 font-medium">Best Day</p>
                        <p className="text-2xl font-bold text-purple-800">
                          ${Math.max(...earningsData.map(d => d.amount)).toFixed(2)}
                        </p>
                        <p className="text-xs text-purple-600">
                          {new Date(earningsData.find(d => d.amount === Math.max(...earningsData.map(d => d.amount)))?.date || '').toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h3 className="mb-6 text-lg font-medium text-gray-900">Messages</h3>
                <div className="p-6 bg-white border rounded-lg">
                  <p className="text-gray-600">Message center coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Gig Modal */}
      <CreateGigForm
        isOpen={isCreateGigModalOpen}
        onClose={() => setIsCreateGigModalOpen(false)}
        onSubmit={(gigData) => {
          console.log('Gig created:', gigData);
          // You can add additional logic here like refreshing the gigs list
          setIsCreateGigModalOpen(false);
        }}
      />

      {/* Edit Gig Modal */}
      <EditGigModal
        isOpen={isEditGigModalOpen}
        onClose={() => {
          setIsEditGigModalOpen(false);
          setSelectedGig(null);
        }}
        gig={selectedGig}
        onSave={handleGigSaved}
      />

      {/* View Gig Modal */}
      <ViewGigModal
        isOpen={isViewGigModalOpen}
        onClose={() => {
          setIsViewGigModalOpen(false);
          setSelectedGig(null);
        }}
        gig={selectedGig}
      />
    </div>
  );
};

export default ExpertDashboard;