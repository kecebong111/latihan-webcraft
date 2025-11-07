import { getCommunityBySlug, isUserFollowingCommunity } from "@/actions/community"
import { getCommunityPosts } from "@/actions/post"
import PostCard from "@/components/feed/post-card"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { Users, FileText, Calendar, Plus } from "lucide-react"
import FollowButton from "@/components/community/follow-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CommunityPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const community = await getCommunityBySlug(slug)
  const session = await auth()
  
  if (!community) {
    notFound()
  }

  const posts = await getCommunityPosts(community.id)
  const isFollowing = session?.user?.id ? await isUserFollowingCommunity(session.user.id, community.id) : false

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Avatar className="h-16 w-16 flex-shrink-0">
                <AvatarImage src={community.icon || ""} alt={community.name} />
                <AvatarFallback className="text-2xl">
                  {community.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <CardTitle className="text-2xl break-words">{community.name}</CardTitle>
                <p className="text-sm text-muted-foreground">c/{community.slug}</p>
                {community.description && (
                  <p className="mt-2 text-sm break-words">{community.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex-shrink-0 ml-4">
              <FollowButton communityId={community.id} isFollowing={isFollowing} size="sm" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <div>
                <div className="text-lg font-semibold">{community._count.follows}</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <div>
                <div className="text-lg font-semibold">{community._count.posts}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <div>
                <div className="text-lg font-semibold">
                  {new Date(community.createdAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-muted-foreground">Created</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Posts</h2>
        {isFollowing && (
          <Button asChild>
            <Link href={`/c/${slug}/create-post`}>
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Link>
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {posts.posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-muted-foreground">
                Be the first to post in this community!
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.posts.map((post: any) => (
            <PostCard key={post.id} post={{
              ...post,
              createdAt: post.createdAt.toISOString(),
              author: {
                ...post.author,
                name: post.author.name || "Anonymous"
              }
            }} />
          ))
        )}
      </div>
    </div>
  )
}