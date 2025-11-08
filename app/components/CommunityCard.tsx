'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommunityCardProps {
  id: string;
  community: any;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  memberCount: number;
  bio?: string;
  onJoin: (communityId: string) => void;
  className?: string;
  onJoinClick?: (community: any) => void;
  isJoined: boolean;
}

export default function CommunityCard({ 
  id,
  community,
  imageUrl, 
  imageAlt = "Community image", 
  title, 
  memberCount, 
  bio,
  onJoin,
  onJoinClick,
  className = "",
  isJoined
}: CommunityCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [currentMemberCount, setCurrentMemberCount] = useState(memberCount);

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (onJoinClick) {
      onJoinClick(community);
    } else {
      setCurrentMemberCount(prev => isJoined ? prev - 1 : prev + 1);
      onJoin(id);
    }
  };

  const handleCardClick = () => {
    router.push(`/community/${id}`);
  };

  const formatMemberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div 
      className={`flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gray-750 hover:scale-[1.02] ${className}`}
      onClick={handleCardClick}
    >
      {/* Photo Section */}
      <div className="w-full h-32 bg-gray-200 flex items-center justify-center relative">
        {imageUrl && !imageError ? (
          <>
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-300" />
            )}
            <img 
              src={imageUrl} 
              alt={imageAlt} 
              className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </>
        ) : (
          <span className="text-gray-500">{imageAlt}</span>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="font-bold text-white mb-2 line-clamp-2 hover:text-blue-300 transition-colors duration-300">
          {title}
        </h3>
      </div>
      
      {/* Footer with Join Button and Member Count */}
      <div 
        className="px-4 py-3 bg-gray-700 flex justify-between items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm text-gray-300 transition-colors duration-300">
          {formatMemberCount(currentMemberCount)} {currentMemberCount === 1 ? 'person' : 'people'}
        </span>
        <button 
          onClick={handleJoin}
          className={`
            relative overflow-hidden
            px-4 py-2 rounded-lg text-sm font-medium 
            transition-all duration-300 ease-out
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
            group
            ${
              isJoined 
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white focus:ring-gray-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white focus:ring-blue-500'
            }
          `}
          aria-label={`${isJoined ? 'Leave' : 'Join'} ${title} community`}
        >
          {/* Animated background shine effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          {/* Button content */}
          <span className="relative flex items-center justify-center gap-2">
            <span className="transition-all duration-300 group-hover:scale-105">
              {isJoined ? 'Leave' : 'Join'}
            </span>
            
            {/* Animated icon */}
            {!isJoined ? (
              <svg 
                className="w-4 h-4 transform -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            ) : (
              <svg 
                className="w-4 h-4 transform -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            )}
          </span>

          {/* Ripple effect on click */}
          <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-active:opacity-20 group-active:animate-ping duration-300" />
        </button>
      </div>
    </div>
  );
}