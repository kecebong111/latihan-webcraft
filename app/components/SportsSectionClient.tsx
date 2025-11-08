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
import { useRouter } from 'next/navigation';

export default function SportsSectionClient({ communities }: SportsSectionClientProps) {
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<(Community & { _count: { follows: number } }) | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function fetchFollowedCommunities() {
      if (session?.user?.id) {
        const followed = await getFollowedCommunities();
        setJoinedCommunities(followed.map(c => c.id));
      }
    }
    fetchFollowedCommunities();
  }, [session]);

  const handleJoinClick = async (community: Community & { _count: { follows: number } }) => {
    // Check if user is authenticated
    if (!session?.user?.id) {
      // Redirect to login with return URL
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    
    // Check if already joined
    if (joinedCommunities.includes(community.id)) {
      // Already a member, just redirect to community page
      router.push(`/c/${community.slug}`);
      return;
    }
    
    // Directly join the community and redirect
    try {
      await followCommunity(session.user.id, community.id);
      setJoinedCommunities(prev => [...prev, community.id]);
      // Redirect to community page after joining
      router.push(`/c/${community.slug}`);
    } catch (error) {
      console.error('Failed to join community:', error);
      // You could show an error message here
    }
  };

  const handleJoinConfirm = async () => {
    if (!selectedCommunity || !session?.user?.id) {
      // Redirect to login if somehow not authenticated
      window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    setIsJoining(true);
    
    try {
      await followCommunity(session.user.id, selectedCommunity.id);
      setJoinedCommunities(prev => [...prev, selectedCommunity.id]);
    } catch (error) {
      console.error('Failed to join community:', error);
      // You could show an error message here
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
        isAuthenticated={!!session?.user?.id}
        joinedCommunities={joinedCommunities}
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