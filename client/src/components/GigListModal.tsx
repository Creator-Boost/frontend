import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Eye } from 'lucide-react';
import { gigService, Gig } from '../services/gigService';

interface GigListModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GigListModal: React.FC<GigListModalProps> = ({ isOpen, onClose }) => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAllGigs();
    }
  }, [isOpen]);

  const fetchAllGigs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const allGigs = await gigService.getAllGigs();
      setGigs(allGigs);
    } catch (err) {
      console.error('Error fetching gigs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch gigs');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLowestPrice = (packages: Gig['packages']) => {
    if (packages.length === 0) return 0;
    return Math.min(...packages.map(pkg => pkg.price));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">All Gigs Database</h2>
            <p className="text-gray-600 mt-1">Verification view of all gigs saved in the database</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              <span className="ml-3 text-gray-600">Loading gigs...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <X className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Gigs</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchAllGigs}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Eye className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Gigs Found</h3>
              <p className="text-gray-600">No gigs have been created yet. Create your first gig to see it here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Total Gigs: {gigs.length}
                </h3>
                <button
                  onClick={fetchAllGigs}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gigs.map((gig) => (
                  <div key={gig.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                    {/* Gig Image */}
                    <div className="relative h-48 bg-gray-100">
                      {gig.images.length > 0 ? (
                        <img
                          src={gig.images.find(img => img.isPrimary)?.url || gig.images[0].url}
                          alt={gig.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Eye className="h-12 w-12" />
                        </div>
                      )}
                      <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                        gig.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gig.status}
                      </span>
                    </div>

                    {/* Gig Content */}
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{gig.title}</h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{gig.description}</p>
                      
                      {/* Platform and Category */}
                      <div className="flex gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {gig.platform}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          {gig.category}
                        </span>
                      </div>

                      {/* Pricing */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-green-600">
                          <DollarSign className="h-4 w-4" />
                          <span className="font-semibold">
                            {gig.packages.length > 0 ? `From $${getLowestPrice(gig.packages)}` : 'No packages'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {gig.packages.length} package{gig.packages.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {/* Seller Info */}
                      <div className="text-xs text-gray-500 mb-3">
                        <div>Seller ID: {gig.sellerId}</div>
                        {gig.createdAt && (
                          <div className="flex items-center mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created: {formatDate(gig.createdAt)}
                          </div>
                        )}
                      </div>

                      {/* Package Details */}
                      {gig.packages.length > 0 && (
                        <div className="border-t pt-3">
                          <h5 className="text-xs font-medium text-gray-700 mb-2">Packages:</h5>
                          <div className="space-y-1">
                            {gig.packages.map((pkg, idx) => (
                              <div key={idx} className="text-xs text-gray-600 flex justify-between">
                                <span>{pkg.name}</span>
                                <span>${pkg.price} ({pkg.deliveryDays}d)</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* FAQs count */}
                      {gig.faqs.length > 0 && (
                        <div className="border-t pt-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {gig.faqs.length} FAQ{gig.faqs.length !== 1 ? 's' : ''} included
                          </span>
                        </div>
                      )}

                      {/* Images count */}
                      <div className="border-t pt-2 mt-2">
                        <span className="text-xs text-gray-500">
                          {gig.images.length} image{gig.images.length !== 1 ? 's' : ''} uploaded
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default GigListModal;