import Navbar from '../components/Navbar';
import { getFollowedCommunities } from '@/actions/community';
import { auth } from '@/lib/auth';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const followedCommunities = session?.user?.id ? await getFollowedCommunities() : [];

  return (
    <>
      <Navbar followedCommunities={followedCommunities} />
      <main>
        {children}
      </main>
    </>
  );
}