"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getAllCommunitiesForAdmin, deleteCommunityAdmin } from "@/actions/admin"
import { Hash, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface AdminCommunity {
  id: string
  name: string
  slug: string
  description?: string | null
  icon?: string | null
  createdAt: string | Date
  creator: {
    id: string
    name?: string | null
  }
  _count: {
    follows: number
    posts: number
  }
}

export default function AdminCommunitiesPage() {
  const { data: session } = useSession()
  const [communities, setCommunities] = useState<AdminCommunity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && (session.user as any)?.role === "ADMIN") {
      getAllCommunitiesForAdmin().then((data) => {
        setCommunities(data)
        setLoading(false)
      })
    }
  }, [session])

  const handleDeleteCommunity = async (communityId: string) => {
    if (confirm("Are you sure you want to delete this community? This action cannot be undone.")) {
      try {
        await deleteCommunityAdmin(communityId)
        setCommunities(communities.filter(community => community.id !== communityId))
      } catch (error) {
        console.error("Failed to delete community:", error)
      }
    }
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Communities</h1>
        <Button asChild>
          <Link href="/admin/communities/create">
            <Plus className="w-4 h-4 mr-2" />
            Create Community
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <Card key={community.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {community.icon ? (
                    <img src={community.icon} alt={community.name} className="w-12 h-12 rounded-lg" />
                  ) : (
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="text-lg font-bold">
                        {community.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <h3 className="font-semibold">{community.name}</h3>
                    <p className="text-sm text-muted-foreground">c/{community.slug}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {community.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {community.description}
                </p>
              )}
              
              <div className="flex justify-between items-center mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold">{community._count.follows}</div>
                  <div className="text-xs text-muted-foreground">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{community._count.posts}</div>
                  <div className="text-xs text-muted-foreground">Posts</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/c/${community.slug}`}>
                    View
                  </Link>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDeleteCommunity(community.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {communities.length === 0 && (
        <div className="text-center py-12">
          <Hash className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold mb-2">No communities yet</h3>
          <p className="text-muted-foreground mb-4">
            Create the first community to get started
          </p>
          <Button asChild>
            <Link href="/admin/communities/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Community
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}