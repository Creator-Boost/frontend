import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreHorizontal, Ban, CheckCircle, Trash2, Loader, Star } from 'lucide-react';
import { useAdminAuthStore } from '../context/useAdminAuthStore';

interface User {
  userId: string;
  name: string;
  email: string;
  role: 'client' | 'provider' | string;
  status?: 'active' | 'suspended';
  joinDate: string;
  totalSpent?: string;
  totalEarned?: string;
  averageRating?: number;
  totalReviews?: number;
  avatar: string;
}

const Users: React.FC = () => {
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'provider' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = useAdminAuthStore((state) => state.getAllUsers);
  const getAllOrders = useAdminAuthStore((state) => state.getAllOrders);

  // Calculate expert ratings from orders
  const calculateExpertRating = (orders: any[], userId: string) => {
    const expertOrders = orders.filter(order => order.sellerId === userId);
    const ordersWithReviews = expertOrders.filter(order => 
      order.review && 
      order.review.rating && 
      order.review.reviewText && 
      order.review.reviewText.trim().length > 0
    );

    if (ordersWithReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = ordersWithReviews.reduce((sum, order) => sum + order.review.rating, 0);
    const averageRating = totalRating / ordersWithReviews.length;

    return {
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews: ordersWithReviews.length
    };
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersData, ordersData] = await Promise.all([
          getAllUsers(),
          getAllOrders()
        ]);

        const mappedUsers: User[] = usersData.map((u) => {
          const { averageRating, totalReviews } = calculateExpertRating(ordersData, u.userId);
          
          return {
            userId: u.userId,
            name: u.name,
            email: u.email,
            role: u.role.toLowerCase(),
            status: 'active', // default placeholder
            joinDate: u.createdAt,
            totalSpent: '$500', // placeholder
            totalEarned: '$1000', // placeholder
            averageRating,
            totalReviews,
            avatar: u.imageUrl || u.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase(),
          };
        });
        setUsers(mappedUsers);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole || (filterRole === 'suspended' && user.status === 'suspended');
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client': return 'bg-blue-100 text-blue-800';
      case 'provider': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader className="animate-spin w-8 h-8 text-blue-500" />
    </div>
  );

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage clients and providers across your platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-2">
            {['all', 'client', 'provider', 'suspended'].map((role) => (
              <button
                key={role}
                onClick={() => setFilterRole(role as typeof filterRole)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterRole === role ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {role === 'all' ? 'All Users' : role.charAt(0).toUpperCase() + role.slice(1)}
                {role === 'suspended' ? 's' : role === 'all' ? '' : 's'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-900">User</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Role</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Join Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-900">Average Rating</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 overflow-hidden">
                        {user.avatar.startsWith('http') ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-medium text-sm">{user.avatar}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status || 'active')}`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6">
                    {user.role === 'provider' ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm font-medium text-gray-900">
                            {(user.averageRating && user.averageRating > 0) ? user.averageRating.toFixed(1) : 'No ratings'}
                          </span>
                        </div>
                        {(user.totalReviews && user.totalReviews > 0) && (
                          <span className="text-xs text-gray-500">
                            ({user.totalReviews} review{user.totalReviews !== 1 ? 's' : ''})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center space-x-2">
                      {user.status === 'active' ? (
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Suspend User">
                          <Ban className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Activate User">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
