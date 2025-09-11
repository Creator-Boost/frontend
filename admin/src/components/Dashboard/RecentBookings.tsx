import React from 'react';
import { Calendar, DollarSign, User } from 'lucide-react';

const RecentBookings: React.FC = () => {
  const recentBookings = [
    {
      id: '#BK-001',
      client: 'Sarah Johnson',
      provider: 'Alex Digital',
      service: 'Logo Design',
      amount: '$150',
      status: 'completed',
      date: '2025-01-15',
    },
    {
      id: '#BK-002',
      client: 'Mike Chen',
      provider: 'Creative Studio',
      service: 'Web Development',
      amount: '$2,500',
      status: 'in-progress',
      date: '2025-01-14',
    },
    {
      id: '#BK-003',
      client: 'Emma Wilson',
      provider: 'Copy Expert',
      service: 'Content Writing',
      amount: '$85',
      status: 'pending',
      date: '2025-01-14',
    },
    {
      id: '#BK-004',
      client: 'David Brown',
      provider: 'SEO Master',
      service: 'SEO Optimization',
      amount: '$300',
      status: 'completed',
      date: '2025-01-13',
    },
    {
      id: '#BK-005',
      client: 'Lisa Anderson',
      provider: 'Social Media Pro',
      service: 'Social Media Management',
      amount: '$450',
      status: 'cancelled',
      date: '2025-01-13',
    },
  ];

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
      </div>

      <div className="space-y-4">
        {recentBookings.map((booking) => (
          <div key={booking.id} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-blue-600">{booking.id}</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.replace('-', ' ')}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <User className="w-3 h-3 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {booking.client} → {booking.provider}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{booking.service}</span>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-gray-400" />
                  <span className="text-sm font-bold text-gray-900">{booking.amount}</span>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                {new Date(booking.date).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          View All Bookings
        </button>
      </div>
    </div>
  );
};

export default RecentBookings;