import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Zap, Star, ArrowRight, Play, Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { servicesData } from '../data/services';

const HomePage: React.FC = () => {
  // Use the first 4 services as featured services
  const featuredServices = servicesData.slice(0, 4);
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