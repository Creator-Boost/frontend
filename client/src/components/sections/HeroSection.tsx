// src/components/sections/HeroSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  title: string;
  highlightedText?: string;
  description: string;
  primaryButton?: {
    text: string;
    link: string;
  };
  secondaryButton?: {
    text: string;
    link: string;
  };
  background?: string;
  textColor?: string;
  highlightColor?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  highlightedText = '',
  description,
  primaryButton = { text: 'Find Experts', link: '/services' },
  secondaryButton = { text: 'Become an Expert', link: '/signup' },
  background = 'bg-gradient-to-r from-emerald-50 to-green-50',
  textColor = 'text-gray-900',
  highlightColor = 'text-emerald-500'
}) => {
  // Split title to insert highlighted text
  const titleParts = title.split(highlightedText);

  return (
    <section className={`${background} py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-4xl md:text-6xl font-bold ${textColor} mb-6`}>
            {titleParts[0]}
            {highlightedText && (
              <span className={highlightColor}>{highlightedText}</span>
            )}
            {titleParts[1]}
          </h1>
          <p className={`text-xl text-gray-600 mb-8 tracking-widest max-w-3xl mx-auto`}>
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {primaryButton && (
              <Link
                to={primaryButton.link}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center gap-2"
              >
                {primaryButton.text} <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            {secondaryButton && (
              <Link
                to={secondaryButton.link}
                className="border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;