import React, { useState, useEffect } from 'react';
import { BarChart3, Download, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { adminReportsService, ReportsData } from '../services/adminReportsService';

const Reports: React.FC = () => {
  const [chartPeriod, setChartPeriod] = useState<'6months' | '1year'>('6months');
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminReportsService.getReportsData();
      setReportsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      await adminReportsService.exportReportsCSV();
      alert('CSV exported successfully!');
    } catch (err) {
      console.error('Error exporting CSV:', err);
      alert('Failed to export CSV');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading reports...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

  if (!reportsData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
          <span className="text-yellow-700">No reports data available</span>
        </div>
      </div>
    );
  }

  const currentData = chartPeriod === '6months' 
    ? reportsData.revenueData6Months 
    : reportsData.revenueData1Year;
  const maxRevenue = Math.max(...currentData.map(d => d.revenue));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Revenue insights and popular services</p>
        </div>
        
        <button
          onClick={handleExportCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-xl">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Monthly Revenue</div>
              <div className="text-2xl font-bold text-gray-900">
                ${reportsData.summary.monthlyRevenue.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${
                reportsData.summary.monthlyRevenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {reportsData.summary.monthlyRevenueGrowth >= 0 ? '+' : ''}
                {reportsData.summary.monthlyRevenueGrowth.toFixed(1)}% from last month
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-xl">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Commission Earned</div>
              <div className="text-2xl font-bold text-gray-900">
                ${reportsData.summary.commissionEarned.toLocaleString()}
              </div>
              <div className="text-sm text-blue-600 font-medium">
                {(reportsData.summary.commissionRate * 100).toFixed(0)}% commission rate
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-xl">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Avg. Transaction</div>
              <div className="text-2xl font-bold text-gray-900">
                ${reportsData.summary.averageTransaction.toLocaleString()}
              </div>
              <div className={`text-sm font-medium ${
                reportsData.summary.averageTransactionGrowth >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {reportsData.summary.averageTransactionGrowth >= 0 ? '+' : ''}
                {reportsData.summary.averageTransactionGrowth.toFixed(1)}% vs last month
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
          </div>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setChartPeriod('6months')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartPeriod === '6months' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              6 Months
            </button>
            <button
              onClick={() => setChartPeriod('1year')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                chartPeriod === '1year' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {currentData.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div 
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-colors cursor-pointer group relative"
                style={{ 
                  height: `${(item.revenue / maxRevenue) * 200}px`,
                  minHeight: '20px'
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ${item.revenue.toLocaleString()}
                </div>
              </div>
              <span className="text-sm font-medium text-gray-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Services */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Most Popular Services</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Service</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Bookings</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Revenue</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reportsData.popularServices.map((service, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900">{service.gigTitle}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{service.bookings}</td>
                  <td className="py-3 px-4 text-center font-medium text-gray-900">
                    ${service.revenue.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${
                      service.growth.startsWith('+') ? 'text-green-600' : 
                      service.growth.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {service.growth}
                    </span>
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

export default Reports;