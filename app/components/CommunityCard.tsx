'use client';

import { useState } from 'react';
import Link from 'next/link'; // Import Link from next/link
import ViewButton from '@/components/community/view-button'; // Import ViewButton

interface CommunityCardProps {
  id: string;
  community: any;
  imageUrl: string;
  imageAlt?: string;
  title: string;
  memberCount: number;
  bio?: string;
  className?: string;
}

export default function CommunityCard({ 
  id,
  community,
  imageUrl, 
  imageAlt = "Community image", 
  title, 
  memberCount, 
  bio,
  className = ""
}: CommunityCardProps) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);





  return (
    <Link href={`/c/${community.slug}`} passHref>
      <div 
        className={`flex-1 bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:bg-gray-750 hover:scale-[1.02] ${className}`}
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
        <div className="px-4 py-3 bg-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-300 transition-colors duration-300">
            {memberCount.toLocaleString()} {memberCount === 1 ? 'person' : 'people'}
          </span>
          
          {/* Use ViewButton for homepage */}
          <ViewButton 
            size="sm"
          />
        </div>
      </div>
    </Link>
  );
}