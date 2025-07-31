import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Shield, Zap, Star, ArrowRight, Play, Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { Service } from '../types/Service';

const HomePage: React.FC = () => {
  const featuredServices: Service[] = [
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
      description: 'I will teach you the proven strategies and techniques to create viral TikTok content that drives massive engagement and follower growth. My methods have generated over 50M views for my clients.',
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
        { url: 'https://images.pexels.com/photos/4050296/pexels-photo-4050296.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 79, deliveryDays: 2, description: '20 viral content ideas with trending hashtags' },
        { name: 'Standard', price: 149, deliveryDays: 4, description: 'Viral content strategy + 30 content ideas + posting schedule' },
        { name: 'Premium', price: 199, deliveryDays: 6, description: 'Complete TikTok growth plan + viral content strategy + trend analysis + 50 content ideas' }
      ],
      faqs: [
        {
          question: 'Do you guarantee viral content?',
          answer: 'While I can\'t guarantee virality, my strategies significantly increase your chances. Most clients see 300%+ engagement improvement.'
        },
        {
          question: 'What niches do you work with?',
          answer: 'I work with all niches including lifestyle, business, education, entertainment, and more. Each strategy is customized to your audience.'
        },
        {
          question: 'Do you help with TikTok ads?',
          answer: 'The Premium package includes basic TikTok ads guidance, but I also offer separate ad management services.'
        }
      ]
    },
    {
      id: '4',
      sellerId: 'seller4',
      title: 'LinkedIn Business Growth',
      description: 'I will optimize your LinkedIn presence and create a comprehensive B2B growth strategy to generate quality leads, build professional networks, and establish thought leadership in your industry.',
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
        { url: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/4050318/pexels-photo-4050318.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      packages: [
        { name: 'Basic', price: 149, deliveryDays: 3, description: 'LinkedIn profile optimization with keyword research' },
        { name: 'Standard', price: 299, deliveryDays: 5, description: 'Profile optimization + content strategy + connection outreach plan' },
        { name: 'Premium', price: 399, deliveryDays: 7, description: 'Complete LinkedIn growth strategy + lead generation system + content calendar + networking plan' }
      ],
      faqs: [
        {
          question: 'Do you help with LinkedIn ads?',
          answer: 'The Premium package includes LinkedIn ads strategy. I also offer separate ad management services for ongoing campaigns.'
        },
        {
          question: 'How do you generate leads?',
          answer: 'I create a systematic approach using optimized content, strategic networking, and targeted outreach to attract quality B2B leads.'
        },
        {
          question: 'What industries do you specialize in?',
          answer: 'I work with B2B companies across all industries including SaaS, consulting, finance, healthcare, and professional services.'
        }
      ]
    }
  ];

  const platforms = [
    { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { name: 'TikTok', icon: Play, color: 'text-purple-500' },
    { name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { name: 'Twitter', icon: Twitter, color: 'text-blue-400' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Grow Your Social Media with{' '}
              <span className="text-emerald-500">Expert Guidance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with top social media experts who will help you build your brand, 
              increase engagement, and achieve real growth across all platforms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/services"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2"
              >
                Find Experts <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/signup"
                className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                Become an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Your Favorite Platforms
            </h2>
            <p className="text-gray-600">
              Get expert help for every social media platform you use
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {platforms.map((platform) => (
              <div key={platform.name} className="text-center group cursor-pointer">
                <div className="bg-gray-50 rounded-full p-6 mb-4 group-hover:bg-emerald-50 transition-colors">
                  <platform.icon className={`h-12 w-12 mx-auto ${platform.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900">{platform.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Services
            </h2>
            <p className="text-gray-600">
              Discover top-rated services from our expert community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose SocialBoost?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verified Experts</h3>
              <p className="text-gray-600">All experts are thoroughly vetted and verified for quality</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">Your money is protected with our secure escrow system</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your projects completed quickly by dedicated professionals</p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Star className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Satisfaction guaranteed or your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-emerald-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-emerald-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-emerald-100">Services Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2K+</div>
              <div className="text-emerald-100">Expert Freelancers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-emerald-100">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Boost Your Social Media?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators and businesses who are already growing their social media presence with expert help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/services"
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;