// src/components/sections/WhyChooseUs.tsx
import React from 'react';
import { Users, Shield, Zap, Star } from 'lucide-react';

interface BenefitItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const WhyChooseUs: React.FC = () => {
  const benefits: BenefitItem[] = [
    {
      icon: Users,
      title: 'Verified Experts',
      description: 'All experts are thoroughly vetted and verified for quality'
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your money is protected with our secure escrow system'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Get your projects completed quickly by dedicated professionals'
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Satisfaction guaranteed or your money back'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose SocialBoost?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="bg-emerald-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <benefit.icon className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;