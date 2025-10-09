import React, { useState, useEffect } from 'react';
import { X, Package, Calendar, DollarSign, FileText, AlertCircle, CreditCard } from 'lucide-react';
import { gigService, type Gig } from '../services/gigService';
import { paymentService } from '../services/paymentService';
import { useAuthStore } from '../context/store/authStore';

interface CreateOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  gigId: string;
  selectedPackageId?: string;
  onOrderCreated?: (order: any) => void;
}

export const CreateOrderForm: React.FC<CreateOrderFormProps> = ({
  isOpen,
  onClose,
  gigId,
  selectedPackageId,
  onOrderCreated: _onOrderCreated
}) => {
  const { user } = useAuthStore();
  const [gig, setGig] = useState<Gig | null>(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState<number>(-1);
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [gigLoading, setGigLoading] = useState(false);

  // Get the selected package based on index
  const selectedPackage = selectedPackageIndex >= 0 && gig ? gig.packages[selectedPackageIndex] : null;

  useEffect(() => {
    if (isOpen && gigId) {
      fetchGigDetails();
    }
  }, [isOpen, gigId]);

  useEffect(() => {
    if (gig && selectedPackageId) {
      // First try to find package by ID (UUID)
      const packageByIdIndex = gig.packages.findIndex(pkg => pkg.id === selectedPackageId);
      if (packageByIdIndex >= 0) {
        setSelectedPackageIndex(packageByIdIndex);
        return;
      }
      
      // Fallback: try to parse selectedPackageId as an index
      const index = parseInt(selectedPackageId);
      if (!isNaN(index) && gig.packages[index]) {
        setSelectedPackageIndex(index);
      }
    }
  }, [gig, selectedPackageId]);

  // Separate effect for setting default package
  useEffect(() => {
    if (gig && gig.packages.length > 0 && selectedPackageIndex < 0 && !selectedPackageId) {
      setSelectedPackageIndex(0);
    }
  }, [gig, selectedPackageIndex, selectedPackageId]);

  const fetchGigDetails = async () => {
    setGigLoading(true);
    setError('');
    try {
      const gigData = await gigService.getGigById(gigId);
      setGig(gigData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gig details');
      console.error(err);
    } finally {
      setGigLoading(false);
    }
  };

  const calculateDeliveryDate = (deliveryDays: number): string => {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + deliveryDays);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gig || !selectedPackage || !requirements.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user?.userId) {
      setError('You must be logged in to create an order');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Store order details in localStorage for use after payment success
      const orderDetails = {
        gigId,
        packageId: selectedPackage.id || `package_${selectedPackageIndex}`, // Use actual package ID if available, fallback to generated ID
        buyerId: user.userId,
        requirements: requirements.trim(),
        gigTitle: gig.title,
        packageName: selectedPackage.name,
        amount: selectedPackage.price
      };
      
      localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));

      // Create checkout session
      const checkoutResponse = await paymentService.createCheckoutSession(selectedPackage.price);
      
      if (checkoutResponse.status === 'success' && checkoutResponse.sessionUrl) {
        // Redirect to Stripe checkout
        paymentService.redirectToCheckout(checkoutResponse.sessionUrl);
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setLoading(false);
    }
  };

  const handlePackageChange = (packageIndex: string) => {
    if (!packageIndex || !gig) return;
    const index = parseInt(packageIndex);
    if (index >= 0 && gig.packages[index]) {
      setSelectedPackageIndex(index);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create Order</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {gigLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading gig details...</span>
            </div>
          ) : gig ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Gig Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{gig.title}</h3>
                <p className="text-gray-600 mb-3">{gig.description}</p>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {gig.platform}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {gig.category}
                  </span>
                </div>
              </div>

              {/* Package Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Package *
                </label>
                <select
                  value={selectedPackageIndex >= 0 ? selectedPackageIndex.toString() : ''}
                  onChange={(e) => handlePackageChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Choose a package</option>
                  {gig.packages.map((pkg, index) => (
                    <option key={index} value={index.toString()}>
                      {pkg.name} - ${pkg.price} ({pkg.deliveryDays} days)
                    </option>
                  ))}
                </select>
                {/* Debug info */}
                <div className="text-xs text-gray-500 mt-1">
                  Debug: Selected index: {selectedPackageIndex}, Package: {selectedPackage?.name || 'None'}
                </div>
              </div>

              {/* Package Details */}
              {selectedPackage && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <Package size={18} />
                    Package Details
                  </h4>
                  <p className="text-blue-800 mb-3">{selectedPackage.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-blue-700">
                      <DollarSign size={16} />
                      <span className="font-semibold">Price: ${selectedPackage.price}</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Calendar size={16} />
                      <span className="font-semibold">Delivery: {selectedPackage.deliveryDays} days</span>
                    </div>
                    <div className="flex items-center gap-2 text-blue-700">
                      <Calendar size={16} />
                      <span className="font-semibold">
                        Due: {calculateDeliveryDate(selectedPackage.deliveryDays)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={18} className="inline mr-1" />
                  Project Requirements *
                </label>
                <textarea
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Describe your project requirements in detail. Include any specific goals, preferences, file formats needed, deadlines, or other important information that will help the seller deliver exactly what you need..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                  required
                  maxLength={2000}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>Be as specific as possible to ensure the best results</span>
                  <span>{requirements.length}/2000 characters</span>
                </div>
              </div>

              {/* Order Summary */}
              {selectedPackage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{gig.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package:</span>
                      <span className="font-medium">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium text-green-600">${selectedPackage.price}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery Time:</span>
                      <span className="font-medium">{selectedPackage.deliveryDays} days</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="text-gray-600">Expected Delivery:</span>
                      <span className="font-medium">
                        {calculateDeliveryDate(selectedPackage.deliveryDays)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-green-600">${selectedPackage.price}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedPackage || !requirements.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <CreditCard size={18} />
                      Proceed to Payment - $${selectedPackage?.price || 0}
                    </span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Failed to load gig details. Please try again.</p>
              <button
                onClick={fetchGigDetails}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateOrderForm;