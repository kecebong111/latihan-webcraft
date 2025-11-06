'use client';

import CommunityCard from './CommunityCard';
import communitiesData from '../data/Communities';
import HeaderSlideshow from './HeaderSlideshow'; // Import the new header component

export default function SportsSection() {
  const handleJoinCommunity = (communityId: number) => {
    console.log(`Joining community ${communityId}`);
  };

  const handleJoinMain = () => {
    console.log("Joining main UKM Tennis");
  };

  return (
    <div className="w-full font-sans bg-gray-900 min-h-screen">
      {/* Header Section with Slideshow */}
      <HeaderSlideshow onJoinMain={handleJoinMain} />

      {/* Active Community Section */}
      <div className="bg-transparent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Active Community</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[500px]">
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