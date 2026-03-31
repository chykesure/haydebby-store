'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const BRAND = {
  teal: '#1A9B8C',
  orange: '#F5A623',
};

const slides = [
  {
    image: '/images/hero/kitchen-hero.png',
    badge: "We're Open — Welcome!",
    title: 'Smart Kitchen',
    titleAccent: 'Appliances',
    description: 'Premium appliances, AI-enhanced for your modern Nigerian kitchen. Quality products that make cooking a joy.',
    cta: 'Shop Now',
    ctaLink: 'products-section',
  },
  {
    image: '/images/hero/kitchen-hero-2.png',
    badge: 'New Arrivals',
    title: 'Cook Like',
    titleAccent: 'a Pro',
    description: 'Discover our latest collection of smart blenders, air fryers, and coffee machines designed for the Nigerian home.',
    cta: 'Explore Products',
    ctaLink: 'products-section',
  },
  {
    image: '/images/hero/kitchen-hero-3.png',
    badge: 'Free Delivery',
    title: 'Delivered to',
    titleAccent: 'Your Door',
    description: 'Order today and enjoy free delivery on orders above ₦50,000. Pay via bank transfer — simple and secure.',
    cta: 'Order Now',
    ctaLink: 'products-section',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh]">
        {/* Slides */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-linear"
              style={{ backgroundImage: `url(${slides[current].image})` }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlay gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-[1]" />

        {/* Content */}
        <div className="relative z-[2] flex h-full items-center px-6 sm:px-12 lg:px-20">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
            <div className="max-w-xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${current}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white"
                    style={{ backgroundColor: `${BRAND.orange}E6` }}
                  >
                    <Sparkles className="h-4 w-4" />
                    {slides[current].badge}
                  </div>

                  <h1 className="mb-4 text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                    {slides[current].title}
                    <br />
                    <span style={{ color: BRAND.orange }}>
                      {slides[current].titleAccent}
                    </span>
                  </h1>

                  <p className="mb-8 max-w-md text-base text-white/80 sm:text-lg">
                    {slides[current].description}
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="gap-2 rounded-full px-8 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105"
                      style={{ backgroundColor: BRAND.teal }}
                      onClick={() => scrollTo(slides[current].ctaLink)}
                    >
                      {slides[current].cta} <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 z-[3] -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 z-[3] -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 z-[3] flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: i === current ? '24px' : '8px',
                backgroundColor: i === current ? BRAND.orange : 'rgba(255,255,255,0.5)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
