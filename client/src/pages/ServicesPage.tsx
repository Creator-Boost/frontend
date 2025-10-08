import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, AlertCircle, Loader } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types/Service';
import { gigService, type Gig } from '../services/gigService';
import Footer from '../components/footer';

const ServicesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gigs from database on component mount
  useEffect(() => {
    const fetchGigs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedGigs = await gigService.getAllGigs();
        setGigs(fetchedGigs);
      } catch (err) {
        console.error('Error fetching gigs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchGigs();
  }, []);

  // Convert Gig to Service format for compatibility with existing components
  const convertGigToService = (gig: Gig): Service => {
    const primaryImage = gig.images.find(img => img.isPrimary) || gig.images[0];
    
    return {
      id: gig.id || Math.random().toString(), // Fallback if id is undefined
      sellerId: gig.sellerId,
      title: gig.title,
      description: gig.description,
      platform: gig.platform,
      category: gig.category,
      status: gig.status as 'ACTIVE' | 'PAUSED' | 'DRAFT',
      createdAt: gig.createdAt || new Date().toISOString(),
      updatedAt: gig.updatedAt || new Date().toISOString(),
      rating: 4.5, // Default rating - you might want to add this to your backend
      reviews: Math.floor(Math.random() * 200) + 10, // Random reviews - replace with real data
      expert: {
        name: 'Expert', // You might want to fetch this from user service
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
        level: 'Level 2'
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

  const services: Service[] = gigs.map(convertGigToService);

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
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader className="h-8 w-8 text-emerald-500 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading services...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error loading services</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Services Content */}
            {!loading && !error && (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ServicesPage;