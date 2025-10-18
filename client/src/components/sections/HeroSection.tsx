// src/components/sections/HeroSection.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextGenerateEffect } from '../ui/text-generate-effect';

// --- Interface and Image Data ---

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
  textColor?: string;
  highlightColor?: string;
}

const images = [
  // 🎥 Content Creation (Focus on dynamic, high-quality shots)
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1920&q=80",  // happy female video editor (higher resolution for hero)
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",  // high angle view video editor
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1920&q=80", // team working at a desk
  // 📊 Digital Marketing Analytics
  'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1920&q=80', // data and graphs
];

// --- Component ---

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  highlightedText = '',
  description,
  primaryButton = { text: 'Find Experts', link: '/services' },
  secondaryButton = { text: 'Become an Expert', link: '/signup' },
  textColor = 'text-white',
  highlightColor = 'text-emerald-400'
}) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Memoize slide functions for better performance/stability
  const prevSlide = useCallback(() =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1)),
    []
  );

  const nextSlide = useCallback(() =>
    setCurrent((prev) => (prev + 1) % images.length),
    []
  );

  // Auto-play effect
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(nextSlide, 7000); // Increased interval to 7s for better viewing
    return () => clearInterval(interval);
  }, [paused, nextSlide]);

  const titleParts = title.split(highlightedText);

  // Animation variants for the content
  const contentVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1,
        duration: 1,
        ease: "easeOut",
      },
    },
  };

  return (
    <section
      className="relative h-[78vh] min-h-[400px] overflow-hidden flex items-center justify-center group bg-gray-600"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background Slider with Enhanced Transition */}
      <AnimatePresence initial={false} mode="wait">
        <motion.img
          key={images[current]}
          src={images[current]}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out will-change-transform scale-100 group-hover:scale-105"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.1 }}
          transition={{ duration: 4 }} // Slower, more cinematic transition
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/70" />


      {/* Content Block: Added Framer Motion for content entry */}
      <motion.div
        className="relative z-20 text-center px-6 max-w-5xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={contentVariants}
      >
        {/* Title: Improved structure for clarity and SEO */}
        <h1 className={`text-4xl md:text-7xl font-extrabold ${textColor} mb-6 tracking-tight`}>
          {titleParts[0]}
          {highlightedText && <span className={highlightColor}>{highlightedText}</span>}
          {titleParts[1]}
        </h1>

        {/* Description: Smoother text generation */}
        <div className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
          {/* Using a delay property on TextGenerateEffect or its parent ensures it runs after the content fade-in */}
          <TextGenerateEffect words={description} className="text-white" />
        </div>

        {/* Buttons: More prominent hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {primaryButton && (
            <Link
              to={primaryButton.link}
              className="group bg-gradient-to-r from-emerald-700 to-cyan-700 hover:from-emerald-600 hover:to-cyan-600 text-white px-10 py-5 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center gap-3 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105"
            >
              {primaryButton.text}
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
          {secondaryButton && (
            <Link
              to={secondaryButton.link}
              className="group border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/50 text-white px-10 py-5 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 shadow-2xl"
            >
              {secondaryButton.text}
            </Link>
          )}
        </motion.div>

      </motion.div>

      {/* Navigation Arrows: Group hover effect for subtlety */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-30 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <button
          onClick={prevSlide}
          className="pointer-events-auto bg-white/10 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-white transition-colors duration-300 shadow-xl ml-4"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="pointer-events-auto bg-white/10 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-white transition-colors duration-300 shadow-xl mr-4"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-6 flex gap-2 justify-center w-full z-30">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ring-2 ring-offset-2 ring-offset-black ${
              i === current ? 'bg-emerald-400 w-5 ring-emerald-400' : 'bg-white/40 hover:bg-white ring-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;