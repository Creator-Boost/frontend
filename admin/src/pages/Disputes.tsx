import React, { useState } from 'react';
import { Search, Filter, AlertTriangle, CheckCircle, ArrowRight, User } from 'lucide-react';

const Disputes: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'resolved' | 'escalated'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const disputes = [
    {
      id: 'DSP-001',
      client: 'Sarah Johnson',
      provider: 'Alex Digital',
      service: 'Logo Design',
      reason: 'Quality not as expected',
      status: 'open',
      priority: 'high',
      submittedDate: '2025-01-15',
      amount: '$150',
      description: 'The delivered logo does not match the requirements discussed. Requesting revision or refund.',
    },
    {
      id: 'DSP-002',
      client: 'Mike Chen',
      provider: 'Creative Studio',
      service: 'Web Development',
      reason: 'Delayed delivery',
      status: 'escalated',
      priority: 'high',
      submittedDate: '2025-01-14',
      amount: '$2,500',
      description: 'Project delivery is 2 weeks overdue with no communication from provider.',
    },
    {
      id: 'DSP-003',
      client: 'Emma Wilson',
      provider: 'Copy Expert',
      service: 'Content Writing',
      reason: 'Communication issues',
      status: 'resolved',
      priority: 'medium',
      submittedDate: '2025-01-13',
      amount: '$85',
      description: 'Provider was unresponsive to messages and revision requests.',
    },
    {
      id: 'DSP-004',
      client: 'David Brown',
      provider: 'SEO Master',
      service: 'SEO Optimization',
      reason: 'Payment dispute',
      status: 'open',
      priority: 'low',
      submittedDate: '2025-01-12',
      amount: '$300',
      description: 'Client claims unauthorized additional charges were applied.',
    },
  ];

  const filteredDisputes = disputes.filter(dispute => {
    const matchesStatus = filterStatus === 'all' || dispute.status === filterStatus;
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'escalated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolve = (disputeId: string) => {
    console.log('Resolving dispute:', disputeId);
  };

  const handleEscalate = (disputeId: string) => {
    console.log('Escalating dispute:', disputeId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disputes Management</h1>
          <p className="text-gray-600">Handle reported issues and resolutions</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex space-x-2">
            {(['all', 'open', 'escalated', 'resolved'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Disputes' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {filteredDisputes.map((dispute) => (
          <div key={dispute.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">{dispute.reason}</h3>
                  <span className="text-sm font-medium text-blue-600">#{dispute.id}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(dispute.priority)}`}>
                  {dispute.priority} priority
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(dispute.status)}`}>
                  {dispute.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Parties Involved</span>
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">Client:</span>
                    <span>{dispute.client}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Provider:</span>
                    <span>{dispute.provider}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><span className="font-medium">Service:</span> {dispute.service}</div>
                  <div><span className="font-medium">Amount:</span> {dispute.amount}</div>
                  <div><span className="font-medium">Submitted:</span> {new Date(dispute.submittedDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-sm text-gray-600">{dispute.description}</p>
            </div>

            {dispute.status !== 'resolved' && (
              <div className="flex space-x-3">
                <button
                  onClick={() => handleResolve(dispute.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolve</span>
                </button>
                {dispute.status !== 'escalated' && (
                  <button
                    onClick={() => handleEscalate(dispute.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Escalate</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Disputes;