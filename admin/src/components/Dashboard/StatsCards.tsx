import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { useAdminAuthStore } from '../../context/useAdminAuthStore';

const StatsCards: React.FC = () => {

  const getAllUsers = useAdminAuthStore((state) => state.getAllUsers);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setTotalUsers(users.length); // dynamically set total users
      } catch (err) {
        console.error('Failed to fetch total users', err);
      }
    };
    fetchUsers();
  }, [getAllUsers]);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(), // dynamic value
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Total Services',
      value: '3,247',
      change: '+8.2%',
      changeType: 'positive',
      icon: Briefcase,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Total Bookings',
      value: '8,956',
      change: '+15.3%',
      changeType: 'positive',
      icon: Calendar,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      title: 'Total Revenue',
      value: '$247,892',
      change: '+23.1%',
      changeType: 'positive',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
            <div className={`p-3 rounded-xl ${stat.iconBg}`}>
              <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;