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
      description: 'All experts are thoroughly vetted and verified for quality',
    },
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Your money is protected with our secure escrow system',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Get your projects completed quickly by dedicated professionals',
    },
    {
      icon: Star,
      title: 'Quality Guaranteed',
      description: 'Satisfaction guaranteed or your money back',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Why Choose SocialBoost?
          </h2>
          <p className="text-gray-600 text-lg tracking-wider max-w-2xl mx-auto">
            We combine expertise, speed, and reliability to deliver results you can trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 group-hover:scale-110 transition-transform duration-300">
                <benefit.icon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-gray-500">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
