'use client';

import { useState, useEffect } from 'react';
import { slideshowData } from '../data/SlideShowData';

interface HeaderSlideshowProps {
  onJoinMain: () => void;
}

export default function HeaderSlideshow({ onJoinMain }: HeaderSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slideshow every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideshowData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideshowData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideshowData.length) % slideshowData.length);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-8 mb-6">
      <div className="w-full h-64 bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
        {/* Slideshow Container */}
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slideshowData.map((slide) => (
            <div
              key={slide.id}
              className="w-full h-full flex-shrink-0 relative"
            >
              {/* Slide Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
                <span className="text-gray-300 text-lg">
                  {slide.imageAlt} {slide.imageUrl ? '(Image)' : '(Placeholder)'}
                </span>
              </div>
              
              {/* Slide Content */}
              <div className="absolute bottom-4 left-4 z-10">
                <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-gray-200 mb-2 drop-shadow-lg">
                  {slide.subtitle}
                </p>
                <button 
                  onClick={onJoinMain}
                  className="bg-green-500 text-white px-6 py-2 rounded font-medium hover:bg-green-600 transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators with Current Position */}
        <div className="absolute bottom-4 right-4 flex items-center space-x-3 z-10 bg-black bg-opacity-50 rounded-full px-3 py-1">
          {/* Previous Button for Mobile */}
          <button
            onClick={prevSlide}
            className="md:hidden text-white p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Current Position Text */}
          <div className="text-white text-sm font-medium">
            {currentSlide + 1} / {slideshowData.length}
          </div>

          {/* Slide Indicators */}
          <div className="hidden md:flex space-x-1">
            {slideshowData.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button for Mobile */}
          <button
            onClick={nextSlide}
            className="md:hidden text-white p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-all"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}