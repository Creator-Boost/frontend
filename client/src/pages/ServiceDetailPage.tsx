import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Clock, CheckCircle, ArrowLeft, MessageCircle, Shield, RefreshCw, Award, Play } from 'lucide-react';
import { Service } from '../types/Service';
import { usePaymentStore } from '../context/store/paymentStore';
import { useAuthStore } from '../context/store/authStore';
import PaymentButton from '../components/PaymentButton';
import toast from 'react-hot-toast';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  
  const { user, isAuthenticated } = useAuthStore();
  const { hasUserPurchasedService, fetchUserPurchases } = usePaymentStore();

  // Check if user has purchased this service
  useEffect(() => {
    if (isAuthenticated && id) {
      fetchUserPurchases();
      const purchased = hasUserPurchasedService(id);
      setHasPurchased(purchased);
    }
  }, [isAuthenticated, id, fetchUserPurchases, hasUserPurchasedService]);

  // Mock service data - in real app, this would come from API
  const service: Service = {
    id: '26090e91-7d3c-42df-8838-adc00cee8ef8',
    sellerId: 'b299b42a-1e3a-4fa6-a8bc-bad60a49e7ad',
    title: 'Full Social Media Audit & Strategy Development',
    description: 'I will provide a comprehensive analysis of your social media presence and create a detailed strategy to boost your engagement, followers, and overall performance. With over 5 years of experience in social media marketing, I\'ve helped hundreds of creators and businesses achieve their goals.',
    platform: 'YouTube',
    category: 'Audit',
    status: 'ACTIVE',
    createdAt: '2025-07-28T21:15:40.339469',
    updatedAt: '2025-07-28T21:15:40.339469',
    rating: 4.9,
    reviews: 127,
    expert: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
      level: 'Top Rated'
    },
    thumbnail: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=400',
    images: [
      { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' },
      { url: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=800' }
    ],
    packages: [
      {
        name: 'Basic',
        price: 50,
        deliveryDays: 3,
        description: 'Quick audit of your current social media presence with basic recommendations'
      },
      {
        name: 'Standard',
        price: 100,
        deliveryDays: 5,
        description: 'Detailed audit with content strategy and optimization recommendations'
      },
      {
        name: 'Premium',
        price: 150,
        deliveryDays: 7,
        description: 'Full audit & comprehensive strategy with competitor analysis and growth plan'
      }
    ],
    faqs: [
      {
        question: 'Do you offer content planning?',
        answer: 'Yes! The Standard and Premium packages include detailed content planning and strategy recommendations.'
      },
      {
        question: 'What access do you need?',
        answer: 'Just your public channel link and any specific goals you want to achieve. No passwords or private access required.'
      },
      {
        question: 'Do you provide ongoing support?',
        answer: 'The Premium package includes 30 days of follow-up support via messages to help implement the strategy.'
      },
      {
        question: 'What platforms do you specialize in?',
        answer: 'I specialize in YouTube, Instagram, and TikTok, with experience across all major social media platforms.'
      }
    ]
  };

  const reviews = [
    {
      id: '1',
      client: 'John Smith',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      date: '2 weeks ago',
      package: 'Premium',
      review: 'Sarah provided incredible insights that helped my channel grow exponentially. Her strategy was detailed and easy to implement. Highly recommended!'
    },
    {
      id: '2',
      client: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      date: '1 month ago',
      package: 'Standard',
      review: 'Amazing work! Sarah helped me understand my audience better and create content that actually engages. My follower count has doubled since implementing her suggestions.'
    },
    {
      id: '3',
      client: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 5,
      date: '1 month ago',
      package: 'Basic',
      review: 'Professional, thorough, and results-driven. Sarah identified areas I never would have thought of and provided actionable solutions.'
    }
  ];

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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reviews ({service.reviews})
              </h3>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start">
                      <img
                        src={review.avatar}
                        alt={review.client}
                        className="w-10 h-10 rounded-full mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.client}</h4>
                            <p className="text-sm text-gray-600">{review.package} Package</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center">
                              {Array.from({ length: review.rating }).map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <p className="text-sm text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.review}</p>
                      </div>
                    </div>
                  </div>
                ))}
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
                    <PaymentButton
                      serviceId={service.id}
                      serviceTitle={service.title}
                      packageName={service.packages[selectedPackage].name}
                      amount={service.packages[selectedPackage].price}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-300 text-white py-3 rounded-lg font-semibold transition-colors"
                    >
                      Continue (${service.packages[selectedPackage].price})
                    </PaymentButton>
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
      </div>
    </div>
  );
};

export default ServiceDetailPage;