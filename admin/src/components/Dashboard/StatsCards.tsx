import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Calendar, DollarSign } from 'lucide-react';
import { useAdminAuthStore } from '../../context/useAdminAuthStore';

const StatsCards: React.FC = () => {

  const getAllUsers = useAdminAuthStore((state) => state.getAllUsers);
  const getAllGigs = useAdminAuthStore((state) => state.getAllGigs);
  const getAllOrders = useAdminAuthStore((state) => state.getAllOrders);
  
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalServices, setTotalServices] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const users = await getAllUsers();
        setTotalUsers(users.length);

        // Fetch gigs (services)
        const gigs = await getAllGigs();
        setTotalServices(gigs.length);

        // Fetch orders
        const orders = await getAllOrders();
        setTotalBookings(orders.length);

        // Calculate total revenue from orders
        const revenue = orders.reduce((sum, order) => sum + order.amount, 0);
        setTotalRevenue(revenue);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, [getAllUsers, getAllGigs, getAllOrders]);

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive',
      icon: Users,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      title: 'Total Services',
      value: totalServices.toLocaleString(),
      change: '+8.2%',
      changeType: 'positive',
      icon: Briefcase,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-100',
    },
    {
      title: 'Total Bookings',
      value: totalBookings.toLocaleString(),
      change: '+15.3%',
      changeType: 'positive',
      icon: Calendar,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
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