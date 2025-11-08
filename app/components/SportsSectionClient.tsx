'use client';

import { useState } from 'react';
import CommunityCard from './CommunityCard';
import JoinConfirmationModal from './JoinConfirmationModal'; // Import the modal
import HeaderSlideshow from './HeaderSlideshow';
import { Community } from '@prisma/client';

interface SportsSectionClientProps {
  communities: (Community & { _count: { follows: number } })[];
}

import { getFollowedCommunities, followCommunity } from '@/actions/community';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SportsSectionClient({ communities }: SportsSectionClientProps) {
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<(Community & { _count: { follows: number } }) | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchFollowedCommunities() {
      if (session?.user?.id) {
        const followed = await getFollowedCommunities();
        setJoinedCommunities(followed.map(c => c.id));
      }
    }
    fetchFollowedCommunities();
  }, [session]);

  const handleJoinClick = (community: Community & { _count: { follows: number } }) => {
    setSelectedCommunity(community);
    setIsModalOpen(true);
  };

  const handleJoinConfirm = async () => {
    if (!selectedCommunity || !session?.user?.id) return;

    setIsJoining(true);
    
    try {
      await followCommunity(session.user.id, selectedCommunity.id);
      setJoinedCommunities(prev => [...prev, selectedCommunity.id]);
    } catch (error) {
      console.error('Failed to join community:', error);
    } finally {
      setIsJoining(false);
      setIsModalOpen(false);
    }
  };

  const handleJoinCommunity = (communityId: string) => {
    console.log(`Joining community ${communityId}`);
    setJoinedCommunities(prev => [...prev, communityId]);
    // Add your join logic here
  };

  const handleJoinMain = () => {
    console.log("Joining main UKM Tennis");
    // Add your join logic here
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCommunity(null);
  };

  return (
    <div className="w-full font-sans bg-gray-900 min-h-screen">
      {/* Header Section with Slideshow */}
      <HeaderSlideshow
        communities={communities}
        onJoinMain={handleJoinMain}
        onJoinClick={handleJoinClick}
      />

      {/* Active Community Section */}
      <div className="bg-transparent rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Active Community</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map(community => (
            <CommunityCard
              key={community.id}
              id={community.id}
              community={community}
              imageUrl={community.icon || ""}
              imageAlt={community.name}
              title={community.name}
              memberCount={community._count.follows}
              bio={community.description || ""}
              onJoin={handleJoinCommunity}
              onJoinClick={handleJoinClick} // Pass the click handler
              isJoined={joinedCommunities.includes(community.id)}
            />
          ))}
        </div>
      </div>

      {/* Join Confirmation Modal */}
      <JoinConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleJoinConfirm}
        community={selectedCommunity}
        isJoining={isJoining}
      />
    </div>
  );
}