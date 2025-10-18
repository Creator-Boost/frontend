// src/components/sections/StatsSection.tsx
import React from 'react';

interface StatItem {
  value: string;
  label: string;
}

const StatsSection: React.FC = () => {
  const stats: StatItem[] = [
    {
      value: '50K+',
      label: 'Active Users'
    },
    {
      value: '10K+',
      label: 'Services Completed'
    },
    {
      value: '2K+',
      label: 'Expert Freelancers'
    },
    {
      value: '4.9',
      label: 'Average Rating'
    }
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((stat, index) => (
            <div key={index}>
              <div className="text-4xl  text-black font-bold mb-2">{stat.value}</div>
              <div className="text-emerald-600 tracking-wider font-mono">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;