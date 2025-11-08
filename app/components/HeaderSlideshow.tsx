'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Community } from '@prisma/client';

interface HeaderSlideshowProps {
  communities: (Community & { _count: { follows: number } })[];
  onJoinMain?: () => void;
  onJoinClick?: (community: Community & { _count: { follows: number } }) => void;
}

export default function HeaderSlideshow({ communities = [], onJoinMain, onJoinClick }: HeaderSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Use all communities for slideshow
  const featuredCommunities = communities.slice(0, 4);

  // Auto-advance slideshow with pause on hover
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCommunities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredCommunities.length, isPaused]);

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCommunities.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCommunities.length) % featuredCommunities.length);
  };

  // Handle slide click to navigate to community pages
  const handleSlideClick = (communitySlug: string) => {
    router.push(`/c/${communitySlug}`);
  };

  // Handle join button click
  const handleJoinClick = (e: React.MouseEvent, community: Community & { _count: { follows: number } }) => {
    e.stopPropagation();
    
    if (onJoinClick) {
      // Use the modal approach if onJoinClick is provided
      onJoinClick(community);
    } else {
      // Fallback to direct navigation
      handleSlideClick(community.slug);
    }
  };

  // Get community description based on title
  const getDescription = (title: string) => {
    switch (title) {
      case 'GAMABAND':
        return 'Join UGM\'s premier music band community. Perform at campus events and showcase your musical talents.';
      case 'Tim Basket UGM':
        return 'Compete in university basketball tournaments and train with UGM\'s official basketball team.';
      case 'GAMAFORCE':
        return 'Be part of UGM\'s largest and most active student community with diverse interests and activities.';
      case 'Tim Bola UGM':
        return 'Represent UGM in football competitions and develop your skills with professional coaching.';
      case 'UGM eSports':
        return 'Compete in gaming tournaments, join gaming sessions, and connect with fellow esports enthusiasts.';
      case 'UKM Panahan UGM':
        return 'Learn and practice archery with UGM\'s official archery club. All skill levels welcome!';
      default:
        return 'Join this amazing community and connect with fellow UGM students who share your interests.';
    }
  };

  // Fallback colors if images fail to load
  const getFallbackColor = (title: string) => {
    const colors = {
      'GAMABAND': 'from-purple-500 to-pink-600',
      'Tim Basket UGM': 'from-blue-500 to-green-600',
      'GAMAFORCE': 'from-red-500 to-orange-600',
      'Tim Bola UGM': 'from-green-500 to-blue-600',
      'UGM eSports': 'from-indigo-500 to-purple-600',
      'UKM Panahan UGM': 'from-yellow-500 to-red-600'
    };
    return colors[title as keyof typeof colors] || 'from-gray-500 to-gray-700';
  };

  // Get community category
  const getCategory = (title: string) => {
    const categories = {
      'GAMABAND': 'Music & Performance',
      'Tim Basket UGM': 'Sports',
      'GAMAFORCE': 'Student Organization',
      'Tim Bola UGM': 'Sports',
      'UGM eSports': 'Gaming & Esports',
      'UKM Panahan UGM': 'Sports'
    };
    return categories[title as keyof typeof categories] || 'Community';
  };

  // Simulate loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-800 rounded-lg p-6 md:p-8 mb-6 mx-4 md:mx-0">
      <div 
        className="w-full h-64 md:h-80 lg:h-96 bg-gray-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden shadow-xl"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-30">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Slideshow Container */}
        <div 
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {featuredCommunities.map((community, index) => (
            <div
              key={community.id}
              className="w-full h-full flex-shrink-0 relative cursor-pointer group"
              onClick={() => handleSlideClick(community.slug)}
            >
              {/* Background with Image and Fallback - No Overlay */}
              <div 
                className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 ${getFallbackColor(community.name)}`}
                style={{ backgroundImage: `url(/${community.icon || "/photos/profile.jpg"})` }}
              />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center p-6 md:p-8 z-10">
                <div className="text-left max-w-2xl ml-4 md:ml-12 lg:ml-16">
                  {/* Category Badge */}
                  <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs md:text-sm font-medium mb-3 md:mb-4 border border-white/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                    {getCategory(community.name)}
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4 drop-shadow-lg leading-tight">
                    {community.name}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-gray-200 mb-4 md:mb-6 drop-shadow-lg text-sm md:text-lg lg:text-xl max-w-md md:max-w-lg leading-relaxed">
                    {getDescription(community.name)}
                  </p>

                  {/* Stats and CTA Container */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                    {/* Member Count */}
                    <div className="flex items-center text-white">
                      <div className="flex items-center bg-black/30 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                        <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                        </svg>
                        <span className="text-lg md:text-xl font-bold mr-1">{community._count.follows}</span>
                        <span className="text-sm md:text-base">members</span>
                      </div>
                    </div>

                    {/* Join Button - Updated to use modal */}
                    <button 
                      onClick={(e) => handleJoinClick(e, community)}
                      className="
                        bg-gradient-to-r from-blue-500 to-purple-600 
                        text-white px-6 md:px-8 py-2 md:py-3 rounded-lg 
                        font-semibold hover:from-blue-600 hover:to-purple-700 
                        transition-all duration-300 shadow-lg text-sm md:text-lg 
                        hover:scale-105 active:scale-95 flex items-center 
                        group/btn relative overflow-hidden
                      "
                    >
                      {/* Animated background shine */}
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                      
                      {/* Button content */}
                      <span className="relative flex items-center">
                        Join Community
                        <svg 
                          className="w-4 h-4 md:w-5 md:h-5 ml-2 transform transition-transform duration-300 group-hover/btn:translate-x-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>

                      {/* Ripple effect */}
                      <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-active/btn:opacity-20 group-active/btn:animate-ping duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevSlide}
          className="
            absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 z-20 
            bg-black/50 backdrop-blur-sm text-white p-2 md:p-3 rounded-full 
            hover:bg-black/70 transition-all duration-300 
            hover:scale-110 hover:shadow-lg
            active:scale-95
            border border-white/20
            group/prev
          "
          aria-label="Previous slide"
        >
          <svg 
            className="w-4 h-4 md:w-6 md:h-6 transform transition-transform duration-300 group-hover/prev:-translate-x-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="
            absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 z-20 
            bg-black/50 backdrop-blur-sm text-white p-2 md:p-3 rounded-full 
            hover:bg-black/70 transition-all duration-300 
            hover:scale-110 hover:shadow-lg
            active:scale-95
            border border-white/20
            group/next
          "
          aria-label="Next slide"
        >
          <svg 
            className="w-4 h-4 md:w-6 md:h-6 transform transition-transform duration-300 group-hover/next:translate-x-0.5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 md:space-x-3 z-20 backdrop-blur-sm bg-black/30 px-3 py-2 rounded-full border border-white/20">
          {featuredCommunities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 
                ${index === currentSlide 
                  ? 'bg-white scale-125 shadow-lg' 
                  : 'bg-gray-400 hover:bg-gray-300 hover:scale-110'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600/50 z-20">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-100 ease-linear rounded-full"
            style={{ 
              width: isPaused ? '100%' : '0%',
              transition: isPaused ? 'none' : 'width 5000ms linear'
            }}
            key={currentSlide}
          />
        </div>

        {/* Slide Counter */}
        <div className="absolute top-4 right-4 z-20 backdrop-blur-sm bg-black/30 px-3 py-1 rounded-full text-white text-sm font-medium border border-white/20">
          {currentSlide + 1} / {featuredCommunities.length}
        </div>
      </div>
    </div>
  );
}
