import React from 'react';
import StatsCards from '../components/Dashboard/StatsCards';
import GrowthChart from '../components/Dashboard/GrowthChart';
import RecentBookings from '../components/Dashboard/RecentBookings';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening on CreatorBoost.</p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GrowthChart />
        </div>
        <div>
          <RecentBookings />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;