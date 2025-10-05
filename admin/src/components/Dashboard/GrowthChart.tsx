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
  const getAllUsers = useAdminAuthStore((state) => state.getAllUsers);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        // Group users by month
        const monthlyCount: Record<string, number> = {};
        users.forEach((u) => {
          const month = new Date(u.createdAt).toLocaleString('default', { month: 'short' });
          monthlyCount[month] = (monthlyCount[month] || 0) + 1;
        });

        // Convert to array sorted by month order
        const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const chartData: UserData[] = monthsOrder
          .filter((m) => monthlyCount[m])
          .map((m) => ({ month: m, value: monthlyCount[m] }));

        setUserData(chartData);
      } catch (err) {
        console.error('Failed to fetch users for chart', err);
      }
    };

    fetchUsers();
  }, [getAllUsers]);

  // Hardcoded revenue data can remain
  const revenueData = [
    { month: 'Jan', value: 12400 },
    { month: 'Feb', value: 15800 },
    { month: 'Mar', value: 18900 },
    { month: 'Apr', value: 22100 },
    { month: 'May', value: 26700 },
    { month: 'Jun', value: 31200 },
  ];

  const currentData = activeTab === 'users' ? userData : revenueData;
  const maxValue = Math.max(...currentData.map(d => d.value));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Growth Analytics</h3>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1">
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
      <div className="h-64 flex items-end justify-between space-x-3">
        {currentData.map((item, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-colors cursor-pointer group relative"
              style={{ 
                height: `${(item.value / maxValue) * 200}px`,
                minHeight: '20px'
              }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                {activeTab === 'revenue' ? `$${item.value.toLocaleString()}` : item.value.toLocaleString()}
              </div>
            </div>
            <span className="text-sm font-medium text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 flex items-center space-x-4 text-sm">
        <div className="flex items-center space-x-2 text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">
            {activeTab === 'users' ? '+24.5%' : '+28.3%'} growth this month
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