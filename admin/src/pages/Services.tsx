import React, { useState, useEffect } from 'react';
import { Search, Filter, Play, Pause, DollarSign, User, Star, AlertCircle } from 'lucide-react';
import { adminGigService, type Gig } from '../services/gigService';
import { adminUserService } from '../services/adminUserService';

const Services: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<{ [userId: string]: string }>({});

  useEffect(() => {
    fetchGigs();
  }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all gigs
      const allGigs = await adminGigService.getAllGigs();
      setGigs(allGigs);

      // Fetch user names for all sellers
      const sellerIds = [...new Set(allGigs.map(gig => gig.sellerId))];
      const userNamePromises = sellerIds.map(async (sellerId) => {
        try {
          const userProfile = await adminUserService.getUserProfile(sellerId);
          return { [sellerId]: userProfile.name };
        } catch (error) {
          return { [sellerId]: 'Unknown User' };
        }
      });

      const userNameResults = await Promise.all(userNamePromises);
      const userNamesMap = userNameResults.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setUserNames(userNamesMap);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (gigId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Paused' : 'Active';
      await adminGigService.updateGigStatus(gigId, newStatus);
      
      // Update local state
      setGigs(prevGigs => 
        prevGigs.map(gig => 
          gig.id === gigId ? { ...gig, status: newStatus } : gig
        )
      );
    } catch (err) {
      console.error('Error updating gig status:', err);
      alert('Failed to update gig status');
    }
  };

  const filteredGigs = gigs.filter(gig => {
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && gig.status === 'Active') ||
      (filterStatus === 'paused' && gig.status === 'Paused');
    
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (userNames[gig.sellerId] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gig.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'Paused':
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
        <span className="ml-3 text-gray-600">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      </div>
    );
  }

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
            {(['all', 'active', 'paused'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All Services' : status.charAt(0).toUpperCase() + status.slice(1) + ' Services'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGigs.map((gig) => (
          <div key={gig.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">{gig.title}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                  <User className="w-3 h-3" />
                  <span>{userNames[gig.sellerId] || 'Loading...'}</span>
                </div>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {gig.category}
                </span>
              </div>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(gig.status)}`}>
                {gig.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{gig.description}</p>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-600">
                  ${Math.min(...gig.packages.map(pkg => pkg.price))} - ${Math.max(...gig.packages.map(pkg => pkg.price))}
                </span>
              </div>
              {gig.averageRating && gig.averageRating > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{gig.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">({gig.totalReviews || 0})</span>
                </div>
              )}
            </div>

            {gig.createdAt && (
              <div className="text-xs text-gray-500 mb-4">
                Created: {new Date(gig.createdAt).toLocaleDateString()}
              </div>
            )}

            {/* Pause/Unpause Button */}
            <div className="flex space-x-2">
              <button
                onClick={() => handleStatusToggle(gig.id!, gig.status)}
                className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  gig.status === 'Active' 
                    ? 'bg-yellow-600 text-white hover:bg-yellow-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {gig.status === 'Active' ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Activate</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGigs.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">No services found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Services;