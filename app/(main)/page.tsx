import SportsSectionClient from '../components/SportsSectionClient';
import Navbar from '../components/Navbar'; // Import Navbar
import { getFollowedCommunities, getAllCommunities } from '@/actions/community';

export default async function Home() {
  const followedCommunities = await getFollowedCommunities();
  const communities = await getAllCommunities();
  return (
    <>
      <Navbar followedCommunities={followedCommunities} /> {/* Render Navbar */}
      <main>
        <SportsSectionClient communities={communities} />
      </main>
    </>
  );
}