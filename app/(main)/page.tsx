import SportsSectionClient from '@/app/components/SportsSectionClient';
import { getAllCommunities } from '@/actions/community';

export default async function Home() {
  const communities = await getAllCommunities();
  return (
    <>
      <SportsSectionClient communities={communities} />
    </>
  );
}