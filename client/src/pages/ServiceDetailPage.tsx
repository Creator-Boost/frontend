import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, CheckCircle, ArrowLeft, MessageCircle, Shield, RefreshCw, Award, Play, Loader, AlertCircle } from 'lucide-react';
import { Service } from '../types/Service';
import { usePaymentStore } from '../context/store/paymentStore';
import { useAuthStore } from '../context/store/authStore';
import CreateOrderForm from '../components/CreateOrderForm';
import ReviewList from '../components/ReviewList';
import ReviewSummary from '../components/ReviewSummary';
import { gigService, type Gig } from '../services/gigService';
import { userService, type UserProfile } from '../services/userService';
import { reviewService, type Review, type ReviewStats } from '../services/reviewService';
import toast from 'react-hot-toast';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  const { isAuthenticated } = useAuthStore();
  const { hasUserPurchasedService, fetchUserPurchases } = usePaymentStore();

  // Convert Gig to Service format for compatibility with existing UI components
  const convertGigToService = (gig: Gig, seller: UserProfile | null, reviewStats: ReviewStats): Service => {
    const primaryImage = gig.images.find(img => img.isPrimary) || gig.images[0];
    
    // Use backend rating data if available, otherwise use calculated stats
    const rating = gig.averageRating || reviewStats.averageRating || 0;
    const totalReviews = gig.totalReviews || reviewStats.totalReviews || 0;
    
    return {
      id: gig.id || Math.random().toString(),
      sellerId: gig.sellerId,
      title: gig.title,
      description: gig.description,
      platform: gig.platform,
      category: gig.category,
      status: gig.status as 'ACTIVE' | 'PAUSED' | 'DRAFT',
      createdAt: gig.createdAt || new Date().toISOString(),
      updatedAt: gig.updatedAt || new Date().toISOString(),
      rating: rating,
      reviews: totalReviews,
      expert: {
        name: seller?.name || 'Expert',
        avatar: seller ? userService.getUserAvatarUrl(seller.imageUrl, seller.name) : 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2' // You might want to add this to your user profile
      },
      thumbnail: primaryImage?.url || 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: gig.images.map(img => ({ url: img.url })),
      packages: gig.packages.map(pkg => ({
        name: pkg.name,
        price: pkg.price,
        deliveryDays: pkg.deliveryDays,
        description: pkg.description
      })),
      faqs: gig.faqs
    };
  };

  // Fetch gig data from API
  useEffect(() => {
    const fetchGig = async () => {
      if (!id) {
        setError('No gig ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch the gig
        const fetchedGig = await gigService.getGigById(id);
        
        // Fetch the seller profile
        const seller = await userService.getUserProfile(fetchedGig.sellerId);
        
        // Fetch review statistics
        const stats = await reviewService.getReviewStatsForGig(id);
        
        // Convert gig to service with seller info and review stats
        const convertedService = convertGigToService(fetchedGig, seller, stats);
        setService(convertedService);
        
      } catch (err) {
        console.error('Error fetching gig:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch service details');
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  // Fetch reviews separately
  useEffect(() => {
    const fetchReviews = async () => {
      if (!id) return;

      try {
        setReviewsLoading(true);
        const fetchedReviews = await reviewService.getReviewsForGig(id);
        setReviews(fetchedReviews);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        // Don't set error state for reviews, just log it
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);

  // Check if user has purchased this service
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchUserPurchases();
      const purchased = hasUserPurchasedService(id);
      setHasPurchased(purchased);
    }
  }, [isAuthenticated, id, fetchUserPurchases, hasUserPurchasedService]);

  const handleContinueToOrder = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      navigate('/auth/login');
      return;
    }
    setShowOrderForm(true);
  };

  const handleOrderCreated = (order: any) => {
    toast.success(`Order created successfully! Order ID: ${order.id.substring(0, 8)}...`);
    setShowOrderForm(false);
    // Optionally navigate to order details or dashboard
    navigate('/dashboard/client');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-6">
          <Link to="/services" className="flex items-center text-emerald-600 hover:text-emerald-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Link>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="h-8 w-8 text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Loading service details...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Error loading service</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Service Content */}
        {!loading && !error && service && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="relative">
                <img
                  src={service.images[selectedImageIndex]?.url}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {service.platform}
                  </span>
                </div>
              </div>
              {service.images.length > 1 && (
                <div className="p-4">
                  <div className="flex gap-2 overflow-x-auto">
                    {service.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                          selectedImageIndex === index ? 'border-emerald-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <img
                  src={service.expert.avatar}
                  alt={service.expert.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{service.expert.name}</h3>
                  <p className="text-emerald-600 text-sm flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {service.expert.level}
                  </p>
                </div>
                <div className="ml-auto flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="ml-1 font-semibold">{service.rating}</span>
                  <span className="ml-1 text-gray-600">({service.reviews} reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h1>
              <p className="text-gray-700 leading-relaxed">{service.description}</p>
            </div>

            {/* What You Get */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What You Get</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Money-back guarantee</span>
                </div>
                <div className="flex items-center">
                  <RefreshCw className="h-5 w-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Unlimited revisions</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-emerald-500 mr-3" />
                  <span className="text-gray-700">Professional quality</span>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {service.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Customer Reviews
              </h3>
              
              {/* Review Summary */}
              {service.reviews > 0 && (
                <ReviewSummary
                  averageRating={service.rating}
                  totalReviews={service.reviews}
                />
              )}
              
              {/* Individual Reviews */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">
                  All Reviews ({service.reviews})
                </h4>
                <ReviewList
                  reviews={reviews}
                  loading={reviewsLoading}
                  emptyMessage="No reviews yet"
                  emptySubMessage="Be the first to review this service!"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Package Selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Package</h3>
              
              {/* Package Tabs */}
              <div className="flex border-b border-gray-200 mb-4">
                {service.packages.map((pkg, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPackage(index)}
                    className={`flex-1 py-2 px-3 text-sm font-medium border-b-2 ${
                      selectedPackage === index
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {pkg.name}
                  </button>
                ))}
              </div>

              {/* Selected Package Details */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-gray-900">
                    {service.packages[selectedPackage].name}
                  </h4>
                  <span className="text-2xl font-bold text-gray-900">
                    ${service.packages[selectedPackage].price}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {service.packages[selectedPackage].description}
                </p>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {service.packages[selectedPackage].deliveryDays} day delivery
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {hasPurchased ? (
                  <>
                    <button 
                      onClick={() => navigate(`/service/${id}`)}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Play className="h-5 w-5" />
                      Access Course
                    </button>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                      <p className="text-emerald-700 text-sm font-medium">
                        ✓ You have access to this course
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleContinueToOrder}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Continue to Order (${service.packages[selectedPackage].price})
                    </button>
                    <button className="w-full border border-emerald-500 text-emerald-600 hover:bg-emerald-50 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Contact Seller
                    </button>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-1" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    <span>Refund</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-1" />
                    <span>Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Order Creation Modal */}
      {service && (
        <CreateOrderForm
          isOpen={showOrderForm}
          onClose={() => setShowOrderForm(false)}
          gigId={service.id}
          selectedPackageId={service.packages[selectedPackage]?.id || selectedPackage.toString()} // Use actual package ID if available
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  );
};

export default ServiceDetailPage;