'use client';

import { useState } from 'react';
import CommunityCard from './CommunityCard';
import communitiesData from '../data/Communities';
import HeaderSlideshow from './HeaderSlideshow';

export default function SportsSectionClient() {
  const [joinedCommunities, setJoinedCommunities] = useState<number[]>([]);

  const handleJoinCommunity = (communityId: number) => {
    console.log(`Joining community ${communityId}`);
    setJoinedCommunities(prev => [...prev, communityId]);
    // Add your join logic here
  };

  const handleJoinMain = () => {
    console.log("Joining main UKM Tennis");
    // Add your join logic here
  };

  return (
    <div className="w-full font-sans bg-gray-900 min-h-screen">
      {/* Header Section with Slideshow */}
      <HeaderSlideshow onJoinMain={handleJoinMain} />

      {/* Active Community Section */}
      <div className="bg-transparent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Active Community</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communitiesData.map(community => (
            <CommunityCard
              key={community.id}
              {...community}
              onJoin={() => handleJoinCommunity(community.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}