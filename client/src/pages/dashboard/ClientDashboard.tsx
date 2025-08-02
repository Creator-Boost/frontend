import React, { useState } from 'react';
import { Plus, Search, Clock, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const ClientDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Active Orders', value: '5', icon: Clock, color: 'text-blue-600' },
    { label: 'Completed Orders', value: '23', icon: CheckCircle, color: 'text-green-600' },
    { label: 'Total Spent', value: '$3,850', icon: Plus, color: 'text-purple-600' },
    { label: 'Saved Experts', value: '12', icon: Search, color: 'text-yellow-600' }
  ];

  const activeOrders = [
    {
      id: '1',
      title: 'YouTube Channel Growth Strategy',
      expert: 'Sarah Johnson',
      expertAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: 299,
      status: 'In Progress',
      dueDate: '2025-01-15',
      progress: 60
    },
    {
      id: '2',
      title: 'Instagram Content Strategy',
      expert: 'Mike Chen',
      expertAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: 149,
      status: 'In Review',
      dueDate: '2025-01-12',
      progress: 90
    },
    {
      id: '3',
      title: 'TikTok Content Creation',
      expert: 'Emma Rodriguez',
      expertAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      amount: 199,
      status: 'Started',
      dueDate: '2025-01-18',
      progress: 25
    }
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your orders and manage your projects</p>
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

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Experts
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Post Work Request
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Messages
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {activeOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <img
                            src={order.expertAvatar}
                            alt={order.expert}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{order.title}</p>
                            <p className="text-sm text-gray-600">Expert: {order.expert}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">${order.amount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
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

            {activeTab === 'active orders' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Active Orders</h3>
                <div className="space-y-6">
                  {activeOrders.map((order) => (
                    <div key={order.id} className="bg-white border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <img
                            src={order.expertAvatar}
                            alt={order.expert}
                            className="w-12 h-12 rounded-full mr-4"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">{order.title}</h4>
                            <p className="text-sm text-gray-600">Expert: {order.expert}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">${order.amount}</p>
                          <p className="text-sm text-gray-600">Due: {order.dueDate}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{order.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-emerald-500 h-2 rounded-full"
                            style={{ width: `${order.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'In Review' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {order.status}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-emerald-600 hover:text-emerald-800 px-3 py-1 text-sm">
                            View Details
                          </button>
                          <button className="text-blue-600 hover:text-blue-800 px-3 py-1 text-sm flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            Message
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'work requests' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Work Requests</h3>
                  <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Post New Request
                  </button>
                </div>
                
                <div className="space-y-4">
                  {workRequests.map((request) => (
                    <div key={request.id} className="bg-white border rounded-lg p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{request.title}</h4>
                          <p className="text-gray-600 mt-1">{request.description}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          request.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm text-gray-600">
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
                <h3 className="text-lg font-medium text-gray-900 mb-6">Order History</h3>
                <div className="bg-white border rounded-lg p-6">
                  <p className="text-gray-600">Order history coming soon...</p>
                </div>
              </div>
            )}

            {activeTab === 'saved experts' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-6">Saved Experts</h3>
                <div className="bg-white border rounded-lg p-6">
                  <p className="text-gray-600">Saved experts coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;