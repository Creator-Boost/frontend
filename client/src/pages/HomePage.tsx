import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { featuredServices} from '../data/dummyData';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import StatsSection from '../components/sections/StatsSection';
import HeroSection from '../components/sections/HeroSection';
import PlatformsScrollingSection from '../components/sections/PlatformsScrollingSection';


const HomePage: React.FC = () => {
    

  
  return (
    <div className="min-h-screen">

    


      {/* Hero Section */}
      <HeroSection
        title="Grow Your Social Media with Expert Guidance"
        highlightedText="Expert Guidance"
        description="Connect with top social media experts who will help you build your brand, increase engagement, and achieve real growth across all platforms."
        primaryButton={{
          text: "Find Experts",
          link: "/services"
        }}
        secondaryButton={{
          text: "Become an Expert",
          link: "/signup"
        }}
      />

      <PlatformsScrollingSection />



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
      <WhyChooseUs />

      {/* Video Section */}

      {/* Stats Section */}
      <StatsSection />

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