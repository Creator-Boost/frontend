import React from 'react';
import { TrendingUp, Calendar, DollarSign } from 'lucide-react';

export interface EarningsDataPoint {
  date: string;
  amount: number;
  orders: number;
}

interface EarningsChartProps {
  data: EarningsDataPoint[];
  period: '7days' | '30days' | '90days' | 'all';
}

const EarningsChart: React.FC<EarningsChartProps> = ({ data, period }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 rounded-lg bg-gray-50">
        <div className="text-center">
          <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">No earnings data available</p>
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...data.map(d => d.amount));
  const minAmount = Math.min(...data.map(d => d.amount));
  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40;

  const getY = (amount: number) => {
    if (maxAmount === minAmount) return chartHeight / 2;
    return chartHeight - ((amount - minAmount) / (maxAmount - minAmount)) * chartHeight;
  };

  const getX = (index: number) => {
    return (index / (data.length - 1)) * chartWidth;
  };

  // Create SVG path for the line
  const pathData = data.map((point, index) => {
    const x = getX(index);
    const y = getY(point.amount);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Create area path for fill
  const areaData = `M 0 ${chartHeight} L ${pathData.substring(2)} L ${chartWidth} ${chartHeight} Z`;

  const totalEarnings = data.reduce((sum, d) => sum + d.amount, 0);
  const totalOrders = data.reduce((sum, d) => sum + d.orders, 0);
  const avgDaily = data.length > 0 ? totalEarnings / data.length : 0;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPeriodLabel = () => {
    switch (period) {
      case '7days': return 'Last 7 Days';
      case '30days': return 'Last 30 Days';
      case '90days': return 'Last 90 Days';
      case 'all': return 'All Time';
      default: return 'Earnings';
    }
  };

  return (
    <div className="p-6 bg-white border rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Earnings Over Time</h3>
          <p className="text-sm text-gray-600">{getPeriodLabel()}</p>
        </div>
        <div className="flex items-center gap-2 text-emerald-600">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm font-medium">
            {data.length > 1 && data[data.length - 1].amount > data[0].amount ? 'Trending Up' : 'Stable'}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-3 text-center rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
        </div>
        <div className="p-3 text-center rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">Total Orders</p>
          <p className="text-xl font-bold text-gray-900">{totalOrders}</p>
        </div>
        <div className="p-3 text-center rounded-lg bg-gray-50">
          <p className="text-sm text-gray-600">Daily Average</p>
          <p className="text-xl font-bold text-gray-900">${avgDaily.toFixed(2)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg 
          width="100%" 
          height={chartHeight + padding * 2} 
          viewBox={`0 0 ${chartWidth + padding * 2} ${chartHeight + padding * 2}`}
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width={chartWidth} height={chartHeight} fill="url(#grid)" transform={`translate(${padding}, ${padding})`} />
          
          {/* Area fill */}
          <path
            d={areaData}
            fill="url(#gradient)"
            transform={`translate(${padding}, ${padding})`}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.05"/>
            </linearGradient>
          </defs>
          
          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`translate(${padding}, ${padding})`}
          />
          
          {/* Data points */}
          {data.map((point, index) => (
            <g key={index}>
              <circle
                cx={getX(index) + padding}
                cy={getY(point.amount) + padding}
                r="4"
                fill="#10b981"
                stroke="white"
                strokeWidth="2"
                className="transition-all cursor-pointer hover:r-6"
              />
              {/* Tooltip on hover */}
              <g className="transition-opacity opacity-0 pointer-events-none hover:opacity-100">
                <rect
                  x={getX(index) + padding - 35}
                  y={getY(point.amount) + padding - 45}
                  width="70"
                  height="35"
                  fill="#1f2937"
                  rx="4"
                />
                <text
                  x={getX(index) + padding}
                  y={getY(point.amount) + padding - 30}
                  textAnchor="middle"
                  className="text-xs fill-white"
                >
                  ${point.amount.toFixed(0)}
                </text>
                <text
                  x={getX(index) + padding}
                  y={getY(point.amount) + padding - 18}
                  textAnchor="middle"
                  className="text-xs fill-gray-300"
                >
                  {formatDate(point.date)}
                </text>
              </g>
            </g>
          ))}
          
          {/* X-axis labels */}
          {data.map((point, index) => {
            // Show labels for first, last, and some middle points
            const showLabel = index === 0 || index === data.length - 1 || index % Math.ceil(data.length / 5) === 0;
            if (!showLabel) return null;
            
            return (
              <text
                key={`label-${index}`}
                x={getX(index) + padding}
                y={chartHeight + padding + 20}
                textAnchor="middle"
                className="text-xs fill-gray-600"
              >
                {formatDate(point.date)}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Data table for mobile/accessibility */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-t">
              <th className="py-2 text-left text-gray-600">Date</th>
              <th className="py-2 text-right text-gray-600">Earnings</th>
              <th className="py-2 text-right text-gray-600">Orders</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(-5).map((point, index) => (
              <tr key={index} className="border-t">
                <td className="py-1 text-gray-900">{formatDate(point.date)}</td>
                <td className="py-1 font-medium text-right text-gray-900">${point.amount.toFixed(2)}</td>
                <td className="py-1 text-right text-gray-600">{point.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EarningsChart;