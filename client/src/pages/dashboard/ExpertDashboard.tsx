import React, { useState } from 'react';
import { Plus, Eye, Edit, DollarSign, TrendingUp, Users, Star, MessageCircle, Database } from 'lucide-react';
import CreateGigForm from '../../components/CreateGigForm';
import GigListModal from '../../components/GigListModal';

const ExpertDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCreateGigModalOpen, setIsCreateGigModalOpen] = useState(false);
  const [isGigListModalOpen, setIsGigListModalOpen] = useState(false);

  const stats = [
    { label: 'Total Earnings', value: '$12,450', icon: DollarSign, color: 'text-green-600' },
    { label: 'Active Gigs', value: '8', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Total Orders', value: '127', icon: Users, color: 'text-purple-600' },
    { label: 'Average Rating', value: '4.9', icon: Star, color: 'text-yellow-600' }
  ];

  const myGigs = [
    {
      id: '1',
      title: 'YouTube Channel Growth Strategy',
      price: 299,
      orders: 15,
      rating: 4.9,
      status: 'Active',
      thumbnail: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '2',
      title: 'Social Media Content Calendar',
      price: 199,
      orders: 23,
      rating: 4.8,
      status: 'Active',
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      id: '3',
      title: 'Instagram Engagement Boost',
      price: 149,
      orders: 8,
      rating: 4.7,
      status: 'Paused',
      thumbnail: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  const recentOrders = [
    {
      id: '1',
      title: 'YouTube Channel Audit',
      client: 'John Smith',
      amount: 299,
      status: 'In Progress',
      dueDate: '2025-01-15'
    },
    {
      id: '2',
      title: 'Content Strategy Plan',
      client: 'Sarah Wilson',
      amount: 199,
      status: 'Delivered',
      dueDate: '2025-01-10'
    },
    {
      id: '3',
      title: 'Social Media Audit',
      client: 'Mike Johnson',
      amount: 149,
      status: 'In Review',
      dueDate: '2025-01-12'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Expert Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your services and track your performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-gray-100 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
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
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{order.title}</p>
                          <p className="text-sm text-gray-600">Client: {order.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'gigs' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">My Gigs</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsGigListModalOpen(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View All Gigs (DB)
                    </button>
                    <button 
                      onClick={() => setIsCreateGigModalOpen(true)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Create New Gig
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myGigs.map((gig) => (
                    <div key={gig.id} className="bg-white border rounded-lg overflow-hidden">
                      <img
                        src={gig.thumbnail}
                        alt={gig.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900 mb-2">{gig.title}</h4>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-lg font-bold text-gray-900">${gig.price}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            gig.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {gig.status}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-4">
                          <span>{gig.orders} orders</span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            {gig.rating}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-2 rounded text-sm flex items-center justify-center gap-1">
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">All Orders</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{order.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.client}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">${order.amount}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {order.dueDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-emerald-600 hover:text-emerald-900 mr-3">
                              View
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Earnings Overview</h3>
                <div className="bg-white border rounded-lg p-6">
                  <p className="text-gray-600">Earnings tracking coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Messages</h3>
                <div className="bg-white border rounded-lg p-6">
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

      {/* View All Gigs Modal */}
      <GigListModal
        isOpen={isGigListModalOpen}
        onClose={() => setIsGigListModalOpen(false)}
      />
    </div>
  );
};

export default ExpertDashboard;