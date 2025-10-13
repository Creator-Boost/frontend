import React from 'react';
import { X, Star, Clock, DollarSign, Eye, MessageCircle } from 'lucide-react';
import { type Gig } from '../services/gigService';

interface ViewGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  gig: Gig | null;
}

const ViewGigModal: React.FC<ViewGigModalProps> = ({ isOpen, onClose, gig }) => {
  if (!isOpen || !gig) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Gig Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Gig Header */}
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{gig.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    Platform: {gig.platform}
                  </span>
                  <span>Category: {gig.category}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    gig.status === 'Active' || gig.status === 'ACTIVE' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {gig.status === 'ACTIVE' ? 'Active' : gig.status === 'INACTIVE' ? 'Paused' : gig.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Images Gallery */}
          {gig.images && gig.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gig.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Gig image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    {image.isPrimary && (
                      <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{gig.description}</p>
            </div>
          </div>

          {/* Packages */}
          {gig.packages && gig.packages.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Packages</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gig.packages.map((pkg, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                      <span className="text-xl font-bold text-emerald-600">${pkg.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-3">{pkg.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {pkg.deliveryDays} day{pkg.deliveryDays !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${pkg.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {gig.faqs && gig.faqs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {gig.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-emerald-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              {gig.createdAt && (
                <div>
                  <span className="font-medium">Created:</span> {new Date(gig.createdAt).toLocaleDateString()}
                </div>
              )}
              {gig.updatedAt && (
                <div>
                  <span className="font-medium">Last Updated:</span> {new Date(gig.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewGigModal;