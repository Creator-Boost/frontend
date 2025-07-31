import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types/Service';

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');

  const services: Service[] = [
    {
      id: '1',
      sellerId: 'seller1',
      title: 'YouTube Channel Growth Strategy',
      description: 'I will provide a comprehensive YouTube channel analysis and create a detailed growth strategy to boost your subscribers, views, and overall performance. With over 5 years of experience in YouTube marketing, I\'ve helped hundreds of creators achieve their goals.',
      platform: 'YouTube',
      category: 'Audit',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
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
        { name: 'Basic', price: 99, deliveryDays: 3, description: 'Quick channel audit with basic recommendations' },
        { name: 'Standard', price: 199, deliveryDays: 5, description: 'Detailed audit with SEO optimization and content strategy' },
        { name: 'Premium', price: 299, deliveryDays: 7, description: 'Full audit & comprehensive growth plan with competitor analysis' }
      ],
      faqs: [
        {
          question: 'What do you need from me to get started?',
          answer: 'Just your YouTube channel link and any specific goals you want to achieve. No passwords or private access required.'
        },
        {
          question: 'Do you provide ongoing support?',
          answer: 'The Premium package includes 30 days of follow-up support via messages to help implement the strategy.'
        },
        {
          question: 'How quickly will I see results?',
          answer: 'Most clients see improvements within 2-4 weeks of implementing the recommendations, with significant growth in 2-3 months.'
        }
      ]
    },
    {
      id: '2',
      sellerId: 'seller2',
      title: 'Instagram Content & Hashtag Strategy',
      description: 'I will create a comprehensive Instagram content strategy and provide targeted hashtag research to boost your engagement, reach, and follower growth. My data-driven approach has helped over 200 accounts achieve their Instagram goals.',
      platform: 'Instagram',
      category: 'Content',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.8,
      reviews: 89,
      expert: {
        name: 'Mike Chen',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2'
      },
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 49, deliveryDays: 2, description: 'Targeted hashtag research with 100+ hashtags' },
        { name: 'Standard', price: 99, deliveryDays: 4, description: 'Content strategy + hashtag research + posting schedule' },
        { name: 'Premium', price: 149, deliveryDays: 6, description: 'Complete Instagram audit + content strategy + hashtag research + competitor analysis' }
      ],
      faqs: [
        {
          question: 'Do you create the actual content?',
          answer: 'I provide content ideas, captions, and strategy. The Standard and Premium packages include detailed content templates you can customize.'
        },
        {
          question: 'How do you research hashtags?',
          answer: 'I use professional tools and manual research to find hashtags with optimal reach-to-competition ratios for your niche.'
        },
        {
          question: 'Will this work for business accounts?',
          answer: 'Absolutely! My strategies work for both personal brands and business accounts across all industries.'
        }
      ]
    },
    {
      id: '3',
      sellerId: 'seller3',
      title: 'TikTok Viral Content Creation',
      description: 'Learn the secrets to creating viral TikTok content that converts',
      platform: 'TikTok',
      category: 'Content',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.9,
      reviews: 156,
      expert: {
        name: 'Emma Rodriguez',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Top Rated'
      },
      thumbnail: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      packages: [
        { name: 'Basic', price: 149, deliveryDays: 1, description: 'Content ideas' },
        { name: 'Premium', price: 199, deliveryDays: 2, description: 'Viral content strategy' }
      ],
      faqs: []
    },
    {
      id: '4',
      sellerId: 'seller4',
      title: 'LinkedIn Business Growth',
      description: 'Professional networking and B2B lead generation strategies',
      platform: 'LinkedIn',
      category: 'Growth',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.7,
      reviews: 73,
      expert: {
        name: 'David Park',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2'
      },
      thumbnail: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      packages: [
        { name: 'Basic', price: 299, deliveryDays: 5, description: 'Profile optimization' },
        { name: 'Premium', price: 399, deliveryDays: 7, description: 'Complete B2B strategy' }
      ],
      faqs: []
    },
    {
      id: '5',
      sellerId: 'seller5',
      title: 'Facebook Ads Campaign Management',
      description: 'Professional Facebook advertising to drive traffic and conversions',
      platform: 'Facebook',
      category: 'Advertising',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.8,
      reviews: 92,
      expert: {
        name: 'Lisa Wang',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Top Rated'
      },
      thumbnail: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/267389/pexels-photo-267389.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      packages: [
        { name: 'Basic', price: 349, deliveryDays: 7, description: 'Basic ad setup' },
        { name: 'Premium', price: 449, deliveryDays: 10, description: 'Full campaign management' }
      ],
      faqs: []
    },
    {
      id: '6',
      sellerId: 'seller6',
      title: 'Twitter Growth & Engagement',
      description: 'Build your Twitter following and increase engagement rates',
      platform: 'Twitter',
      category: 'Growth',
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z',
      rating: 4.6,
      reviews: 64,
      expert: {
        name: 'Alex Thompson',
        avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2'
      },
      thumbnail: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=400',
      images: [
        { url: 'https://images.pexels.com/photos/267371/pexels-photo-267371.jpeg?auto=compress&cs=tinysrgb&w=400' }
      ],
      packages: [
        { name: 'Basic', price: 129, deliveryDays: 3, description: 'Growth strategy' },
        { name: 'Premium', price: 179, deliveryDays: 5, description: 'Complete engagement plan' }
      ],
      faqs: []
    }
  ];

  const platforms = ['All', 'YouTube', 'Instagram', 'TikTok', 'Facebook', 'LinkedIn', 'Twitter'];
  const categories = ['All', 'Strategy', 'Content Creation', 'Advertising', 'Analytics', 'Growth Hacking'];
  const priceRanges = ['All', 'Under $100', '$100-$300', '$300-$500', 'Over $500'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || service.platform === selectedPlatform;
    // Add more filtering logic here
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Services</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <SlidersHorizontal className="h-5 w-5 text-gray-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>

              {/* Platform Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Platform</h4>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <label key={platform} className="flex items-center">
                      <input
                        type="radio"
                        name="platform"
                        value={platform}
                        checked={selectedPlatform === platform}
                        onChange={(e) => setSelectedPlatform(e.target.value)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category}
                        checked={selectedCategory === category}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range} className="flex items-center">
                      <input
                        type="radio"
                        name="priceRange"
                        value={range}
                        checked={priceRange === range}
                        onChange={(e) => setPriceRange(e.target.value)}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">{range}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {filteredServices.length} services found
              </p>
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-emerald-500 focus:border-emerald-500">
                <option>Sort by: Relevance</option>
                <option>Sort by: Price Low to High</option>
                <option>Sort by: Price High to Low</option>
                <option>Sort by: Rating</option>
                <option>Sort by: Newest</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No services found matching your criteria.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;