import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Ban, CheckCircle, Trash2 } from 'lucide-react';

const Users: React.FC = () => {
  const [filterRole, setFilterRole] = useState<'all' | 'client' | 'provider' | 'suspended'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-12-15',
      totalSpent: '$1,250',
      avatar: 'SJ',
    },
    {
      id: 2,
      name: 'Alex Digital',
      email: 'alex@creativestudio.com',
      role: 'provider',
      status: 'active',
      joinDate: '2024-11-20',
      totalEarned: '$3,890',
      avatar: 'AD',
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-12-01',
      totalSpent: '$450',
      avatar: 'MC',
    },
    {
      id: 4,
      name: 'Emma Wilson',
      email: 'emma@copyexpert.com',
      role: 'provider',
      status: 'suspended',
      joinDate: '2024-10-15',
      totalEarned: '$2,100',
      avatar: 'EW',
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@gmail.com',
      role: 'client',
      status: 'active',
      joinDate: '2024-09-30',
      totalSpent: '$850',
      avatar: 'DB',
    },
  ];

  const filteredUsers = users.filter(user => {
    const matchesRole = filterRole === 'all' || user.role === filterRole || (filterRole === 'suspended' && user.status === 'suspended');
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'provider':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
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
                  filterRole === role
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
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
                <th className="text-left py-3 px-6 font-medium text-gray-900">Activity</th>
                <th className="text-center py-3 px-6 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">{user.avatar}</span>
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
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {new Date(user.joinDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                    {user.role === 'client' ? user.totalSpent : user.totalEarned}
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