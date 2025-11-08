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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Community } from "@prisma/client";
import { Users, Home, Trash2, Edit3, Plus, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

type CommunityWithCount = Community & {
  _count: {
    follows: number;
  };
};

export default function AdminCommunitiesPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState<CommunityWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCommunities() {
      const fetchedCommunities = await getAllCommunities();
      setCommunities(fetchedCommunities);
      setLoading(false);
    }
    fetchCommunities();
  }, []);

  const handleDelete = async (communityId: string) => {
    if (confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      setDeleting(communityId);
      try {
        await deleteCommunityAdmin(communityId);
        setCommunities(communities.filter((c) => c.id !== communityId));
      } catch (error) {
        alert("Failed to delete community");
      } finally {
        setDeleting(null);
      }
    }
  };

  const handleBackHome = () => {
    router.push("/");
  };

  const totalMembers = communities.reduce((sum, community) => sum + community._count.follows, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading communities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBackHome}
            className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Communities</h1>
            <p className="text-gray-400">Create, view, and manage all communities</p>
          </div>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Communities</p>
                  <p className="text-2xl font-bold text-white">{communities.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Members</p>
                  <p className="text-2xl font-bold text-green-400">{totalMembers}</p>
                </div>
                <Users className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Average Members</p>
                  <p className="text-2xl font-bold text-purple-400">
                    {communities.length > 0 ? Math.round(totalMembers / communities.length) : 0}
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Communities Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">All Communities</CardTitle>
              <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/admin/communities/create" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Community
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-750">
                  <TableHead className="text-gray-300 font-medium">Community</TableHead>
                  <TableHead className="text-gray-300 font-medium">Slug</TableHead>
                  <TableHead className="text-gray-300 font-medium">Members</TableHead>
                  <TableHead className="text-gray-300 font-medium">Created</TableHead>
                  <TableHead className="text-gray-300 font-medium text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communities.map((community) => (
                  <TableRow key={community.id} className="border-gray-700 hover:bg-gray-750">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {community.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{community.name}</div>
                          {community.description && (
                            <div className="text-sm text-gray-400 line-clamp-1">
                              {community.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        /c/{community.slug}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-white font-medium">{community._count.follows}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-400">
                        {new Date(community.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <Link href={`/c/${community.slug}`} className="flex items-center gap-2">
                            <Eye className="w-3 h-3" />
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                        >
                          <Link href={`/admin/communities/edit/${community.id}`} className="flex items-center gap-2">
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(community.id)}
                          disabled={deleting === community.id}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                        >
                          {deleting === community.id ? (
                            <div className="w-3 h-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {communities.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No communities found</h3>
                <p className="text-gray-500 mb-4">Create the first community to get started</p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/admin/communities/create" className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Create Community
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}