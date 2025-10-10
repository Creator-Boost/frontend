import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useAdminAuthStore } from '../../context/useAdminAuthStore';

interface UserData {
  month: string;
  value: number;
}

const GrowthChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'revenue'>('users');
  const [userData, setUserData] = useState<UserData[]>([]);
  const [revenueData, setRevenueData] = useState<UserData[]>([]);
  const getAllUsers = useAdminAuthStore((state) => state.getAllUsers);
  const getAllOrders = useAdminAuthStore((state) => state.getAllOrders);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users data
        const users = await getAllUsers();
        // Group users by month
        const monthlyUserCount: Record<string, number> = {};
        users.forEach((u) => {
          const month = new Date(u.createdAt).toLocaleString('default', { month: 'short' });
          monthlyUserCount[month] = (monthlyUserCount[month] || 0) + 1;
        });

        // Convert to array sorted by month order
        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const userChartData: UserData[] = monthsOrder
          .filter((m) => monthlyUserCount[m])
          .map((m) => ({ month: m, value: monthlyUserCount[m] }));

        setUserData(userChartData);

        // Fetch orders data for revenue
        const orders = await getAllOrders();
        const monthlyRevenue: Record<string, number> = {};
        
        orders.forEach((order) => {
          const orderDate = new Date(order.createdAt || order.orderDate);
          const month = orderDate.toLocaleString('default', { month: 'short' });
          monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.amount;
        });

        const revenueChartData: UserData[] = monthsOrder
          .filter((m) => monthlyRevenue[m])
          .map((m) => ({ month: m, value: monthlyRevenue[m] }));

        setRevenueData(revenueChartData);
      } catch (err) {
        console.error('Failed to fetch data for chart', err);
      }
    };

    fetchData();
  }, [getAllUsers, getAllOrders]);

  const currentData = activeTab === 'users' ? userData : revenueData;
  const maxValue = Math.max(...currentData.map(d => d.value));

  // Calculate growth percentage
  const calculateGrowthPercentage = (data: UserData[]) => {
    if (data.length < 2) return 0;
    const currentMonth = data[data.length - 1]?.value || 0;
    const previousMonth = data[data.length - 2]?.value || 0;
    if (previousMonth === 0) return 0;
    return ((currentMonth - previousMonth) / previousMonth * 100);
  };

  const userGrowth = calculateGrowthPercentage(userData);
  const revenueGrowth = calculateGrowthPercentage(revenueData);
  const currentGrowth = activeTab === 'users' ? userGrowth : revenueGrowth;

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Growth Analytics</h3>
        </div>
        
        <div className="flex p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'users' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            New Users
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'revenue' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Revenue
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-between h-64 space-x-3">
        {currentData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 space-y-2">
            <div 
              className="relative w-full transition-colors bg-blue-500 rounded-t-lg cursor-pointer hover:bg-blue-600 group"
              style={{ 
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: '20px'
              }}
            >
              <div className="absolute px-2 py-1 text-xs text-white transition-opacity transform -translate-x-1/2 bg-gray-900 rounded opacity-0 -top-8 left-1/2 group-hover:opacity-100">
                {activeTab === 'revenue' ? `$${item.value.toLocaleString()}` : item.value.toLocaleString()}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center mt-6 space-x-4 text-sm">
        <div className={`flex items-center space-x-2 ${currentGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">
            {currentGrowth >= 0 ? '+' : ''}{currentGrowth.toFixed(1)}% growth this month
          </span>
        </div>
        <span className="text-gray-500">
          Compared to last month
        </span>
      </div>
    </div>
  );
};

export default GrowthChart;