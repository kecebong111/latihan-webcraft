'use client';

import CommunityCard from './CommunityCard';
import HeaderSlideshow from './HeaderSlideshow';
import { Community } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface SportsSectionClientProps {
  communities: (Community & { _count: { follows: number } })[];
}

export default function SportsSectionClient({ communities }: SportsSectionClientProps) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="w-full font-sans bg-gray-900 min-h-screen">
      {/* Header Section with Slideshow */}
      <HeaderSlideshow
        communities={communities}
        onJoinMain={async () => router.push('/login')}
        onJoinClick={async () => router.push('/login')}
        isAuthenticated={!!session?.user?.id}
        joinedCommunities={[]}
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
            />
          ))}
        </div>
      </div>
    </div>
  );
}