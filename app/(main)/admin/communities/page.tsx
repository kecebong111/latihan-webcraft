"use client";

import { getAllCommunities } from "@/actions/community";
import { deleteCommunityAdmin } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Community } from "@prisma/client";

type CommunityWithCount = Community & {
  _count: {
    follows: number;
  };
};

export default function AdminCommunitiesPage() {
  const [communities, setCommunities] = useState<CommunityWithCount[]>([]);

  useEffect(() => {
    async function fetchCommunities() {
      const fetchedCommunities = await getAllCommunities();
      setCommunities(fetchedCommunities);
    }
    fetchCommunities();
  }, []);

  const handleDelete = async (communityId: string) => {
    if (confirm("Are you sure you want to delete this community?")) {
      await deleteCommunityAdmin(communityId);
      setCommunities(communities.filter((c) => c.id !== communityId));
    }
  };

  return (
    <div className="w-full font-sans bg-gray-900 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Communities</h1>
        <Button asChild>
          <Link href="/admin/communities/create">Create Community</Link>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Members</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {communities.map((community) => (
            <TableRow key={community.id}>
              <TableCell>{community.name}</TableCell>
              <TableCell>{community.slug}</TableCell>
              <TableCell>{community._count.follows}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(community.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
