import React, { useState } from 'react';
import { Settings as SettingsIcon, Percent, Bell, Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [commissionRate, setCommissionRate] = useState(10);
  const [notification, setNotification] = useState('');
  const [notificationTarget, setNotificationTarget] = useState<'all' | 'clients' | 'providers'>('all');

  const handleSaveSettings = () => {
    console.log('Saving settings...', { commissionRate });
    alert('Settings saved successfully!');
  };

  const handleSendNotification = () => {
    if (!notification.trim()) {
      alert('Please enter a notification message');
      return;
    }
    console.log('Sending notification:', { message: notification, target: notificationTarget });
    alert('Notification sent successfully!');
    setNotification('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure platform settings and send notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission Rate Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Percent className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Commission Rate</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Commission Rate (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="50"
                  step="0.1"
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  %
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This is the percentage taken from each transaction as platform commission.
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Example Calculation</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Service Price: $100</div>
                <div>Commission ({commissionRate}%): ${(100 * (commissionRate / 100)).toFixed(2)}</div>
                <div className="font-medium">Provider Receives: ${(100 - (100 * (commissionRate / 100))).toFixed(2)}</div>
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>

        {/* Notification Broadcast */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Broadcast Notification</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                value={notificationTarget}
                onChange={(e) => setNotificationTarget(e.target.value as typeof notificationTarget)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="clients">Clients Only</option>
                <option value="providers">Providers Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                placeholder="Enter your notification message here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              <div className="text-sm text-gray-500 mt-1">
                {notification.length}/500 characters
              </div>
            </div>

            <button
              onClick={handleSendNotification}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span>Send Notification</span>
            </button>
          </div>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Platform Statistics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">98.5%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">4.7/5</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;