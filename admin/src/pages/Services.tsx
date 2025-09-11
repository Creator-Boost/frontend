import React, { useState } from 'react';
import { Search, Filter, Check, X, DollarSign, User, Star } from 'lucide-react';

const Services: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const services = [
    {
      id: 1,
      title: 'Professional Logo Design',
      provider: 'Alex Digital',
      category: 'Design',
      price: '$150',
      rating: 4.8,
      reviews: 124,
      status: 'pending',
      submittedDate: '2025-01-15',
      description: 'I will create a unique and professional logo for your brand',
    },
    {
      id: 2,
      title: 'Full-Stack Web Development',
      provider: 'Creative Studio',
      category: 'Development',
      price: '$2,500',
      rating: 4.9,
      reviews: 67,
      status: 'approved',
      submittedDate: '2025-01-14',
      description: 'Complete web application development with modern technologies',
    },
    {
      id: 3,
      title: 'SEO Content Writing',
      provider: 'Copy Expert',
      category: 'Writing',
      price: '$85',
      rating: 4.6,
      reviews: 89,
      status: 'approved',
      submittedDate: '2025-01-13',
      description: 'High-quality, SEO-optimized content for your website',
    },
    {
      id: 4,
      title: 'Social Media Management',
      provider: 'Social Media Pro',
      category: 'Marketing',
      price: '$450',
      rating: 0,
      reviews: 0,
      status: 'pending',
      submittedDate: '2025-01-12',
      description: 'Complete social media strategy and daily management',
    },
    {
      id: 5,
      title: 'Basic WordPress Site',
      provider: 'Quick Sites',
      category: 'Development',
      price: '$200',
      rating: 3.2,
      reviews: 15,
      status: 'rejected',
      submittedDate: '2025-01-10',
      description: 'Simple WordPress website setup and customization',
    },
  ];

  const filteredServices = services.filter(service => {
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (serviceId: number) => {
    console.log('Approving service:', serviceId);
    // Here you would typically make an API call
  };

  const handleReject = (serviceId: number) => {
    console.log('Rejecting service:', serviceId);
    // Here you would typically make an API call
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600">Review and manage service listings</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search services..."
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
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Services' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{service.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <User className="w-3 h-3" />
                  <span>{service.provider}</span>
                </div>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {service.category}
                </span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                {service.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-600">{service.price}</span>
              </div>
              {service.rating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-500">({service.reviews})</span>
                </div>
              )}
            </div>

            <div className="text-xs text-gray-500 mb-4">
              Submitted: {new Date(service.submittedDate).toLocaleDateString()}
            </div>

            {service.status === 'pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleApprove(service.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleReject(service.id)}
                  className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;