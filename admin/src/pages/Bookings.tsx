import React, { useState } from 'react';
import { Search, Filter, DollarSign, Calendar, RefreshCw } from 'lucide-react';

const Bookings: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const bookings = [
    {
      id: 'BK-001',
      client: 'Sarah Johnson',
      provider: 'Alex Digital',
      service: 'Logo Design',
      amount: 150,
      commission: 15,
      status: 'completed',
      paymentStatus: 'paid',
      bookingDate: '2025-01-15',
      completionDate: '2025-01-18',
    },
    {
      id: 'BK-002',
      client: 'Mike Chen',
      provider: 'Creative Studio',
      service: 'Web Development',
      amount: 2500,
      commission: 250,
      status: 'in-progress',
      paymentStatus: 'paid',
      bookingDate: '2025-01-14',
      completionDate: null,
    },
    {
      id: 'BK-003',
      client: 'Emma Wilson',
      provider: 'Copy Expert',
      service: 'Content Writing',
      amount: 85,
      commission: 8.5,
      status: 'pending',
      paymentStatus: 'pending',
      bookingDate: '2025-01-14',
      completionDate: null,
    },
    {
      id: 'BK-004',
      client: 'David Brown',
      provider: 'SEO Master',
      service: 'SEO Optimization',
      amount: 300,
      commission: 30,
      status: 'completed',
      paymentStatus: 'paid',
      bookingDate: '2025-01-13',
      completionDate: '2025-01-16',
    },
    {
      id: 'BK-005',
      client: 'Lisa Anderson',
      provider: 'Social Media Pro',
      service: 'Social Media Management',
      amount: 450,
      commission: 45,
      status: 'cancelled',
      paymentStatus: 'refunded',
      bookingDate: '2025-01-13',
      completionDate: null,
    },
  ];

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    const matchesSearch = 
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefund = (bookingId: string) => {
    console.log('Processing refund for booking:', bookingId);
    // Here you would typically make an API call
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="text-gray-600">View and manage all transactions</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-2">
            {(['all', 'pending', 'in-progress', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Bookings' : status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Booking ID</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Client</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Provider</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Service</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Payment</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm font-medium text-blue-600">#{booking.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{booking.client}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{booking.provider}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{booking.service}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">${booking.amount}</div>
                    <div className="text-xs text-gray-500">Commission: ${booking.commission}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center">
                      {booking.paymentStatus === 'paid' && booking.status !== 'cancelled' && (
                        <button
                          onClick={() => handleRefund(booking.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Issue Refund"
                        >
                          <RefreshCw className="w-4 h-4" />
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm text-gray-600">This Month</div>
              <div className="font-bold text-gray-900">$45,320</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-gray-600">Commission Earned</div>
              <div className="font-bold text-gray-900">$4,532</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Pending Payments</div>
          <div className="font-bold text-yellow-600">$1,250</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="text-sm text-gray-600">Refunds Issued</div>
          <div className="font-bold text-red-600">$320</div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;