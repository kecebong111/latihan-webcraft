import { getCommunityBySlug, isUserFollowingCommunity } from "@/actions/community"
import { getCommunityPosts } from "@/actions/post"
import PostCard from "@/components/feed/post-card"
import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { Users, FileText, Calendar, Plus, ArrowLeft, MessageCircle, Trophy, Sparkles } from "lucide-react"
import FollowButton from "@/components/community/follow-button"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

  // Calculate community "vibes" based on stats
  const getCommunityVibe = () => {
    const memberCount = community._count.follows
    const postCount = community._count.posts
    
    if (memberCount > 1000) return { label: "Popular", color: "bg-gradient-to-r from-purple-500 to-pink-500", icon: Trophy }
    if (postCount > 100) return { label: "Active", color: "bg-gradient-to-r from-green-500 to-emerald-500", icon: MessageCircle }
    return { label: "Growing", color: "bg-gradient-to-r from-blue-500 to-cyan-500", icon: Sparkles }
  }

  const vibe = getCommunityVibe()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            asChild 
            className="group hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-gray-600 rounded-xl"
          >
            <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Feed
            </Link>
          </Button>
        </div>

        {/* Enhanced Community Header */}
        <Card className="mb-8 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
          
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-gray-700 shadow-2xl ring-2 ring-blue-500/20">
                    <AvatarImage src={community.icon || ""} alt={community.name} />
                    <AvatarFallback className="text-3xl bg-gradient-to-br from-gray-700 to-gray-600 text-white font-bold">
                      {community.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-2 -right-2 ${vibe.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
                    {vibe.label}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent break-words">
                      {community.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-gray-700/50 text-gray-300 border-gray-600">
                      c/{community.slug}
                    </Badge>
                  </div>
                  
                  {community.description && (
                    <p className="text-lg text-gray-300 leading-relaxed max-w-2xl break-words">
                      {community.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-6">
                <FollowButton 
                  communityId={community.id} 
                  isFollowing={isFollowing} 
                  size="lg"
                />
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10 pt-6 border-t border-gray-700/50">
            <div className="grid grid-cols-3 gap-4">
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer">
                <div className="p-3 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{community._count.follows.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Members</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-green-500/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer">
                <div className="p-3 rounded-xl bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{community._count.posts.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Posts</div>
                </div>
              </div>
              
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/30 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer">
                <div className="p-3 rounded-xl bg-purple-500/20 group-hover:bg-purple-500/30 transition-colors">
                  <Calendar className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-lg font-bold text-white">
                    {new Date(community.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300">Created</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Posts Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <FileText className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Community Posts</h2>
              <p className="text-gray-400 text-sm">
                {posts.posts.length} post{posts.posts.length !== 1 ? 's' : ''} in this community
              </p>
            </div>
          </div>
          
          {isFollowing && (
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <Link href={`/c/${slug}/create-post`}>
                <Plus className="h-5 w-5 mr-2 transition-transform group-hover:rotate-90" />
                Create Post
              </Link>
            </Button>
          )}
        </div>
        
        {/* Posts List */}
        <div className="space-y-6">
          {posts.posts.length === 0 ? (
            <Card className="border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl overflow-hidden">
              <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-20 animate-pulse" />
                  <div className="relative p-6 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No posts yet</h3>
                <p className="text-gray-400 text-lg max-w-md mb-8 leading-relaxed">
                  This community is waiting for its first post. Be the pioneer and start the conversation!
                </p>
                {isFollowing && (
                  <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <Link href={`/c/${slug}/create-post`}>
                      <Plus className="h-5 w-5 mr-2" />
                      Create First Post
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            posts.posts.map((post: any) => (
              <div 
                key={post.id} 
                className="transform transition-all duration-500 hover:scale-[1.02] hover:translate-y-1"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <PostCard 
                    post={{
                      ...post,
                      createdAt: post.createdAt.toISOString(),
                      author: {
                        ...post.author,
                        name: post.author.name || "Anonymous"
                      }
                    }} 
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}