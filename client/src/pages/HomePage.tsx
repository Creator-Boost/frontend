import React from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { featuredServices} from '../data/dummyData';
import WhyChooseUs from '../components/sections/WhyChooseUs';
import StatsSection from '../components/sections/StatsSection';
import HeroSection from '../components/sections/HeroSection';
import PlatformsScrollingSection from '../components/sections/PlatformsScrollingSection';
import Footer from '../components/footer';


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
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center ">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Services
            </h2>
            <p className="text-gray-600 text-lg tracking-wide">
              Discover top-rated services from our expert community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
          <div className="text-center ">
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

      <Footer />

     
    </div>
  );
};

export default HomePage;