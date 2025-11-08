import { getAllPosts } from '@/actions/post';
import PostCard from '@/components/feed/post-card';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, TrendingUp, Users, Hash } from 'lucide-react';

export default async function PostPage() {
  const { posts } = await getAllPosts();

  const stats = {
    totalPosts: posts.length,
    totalComments: posts.reduce((sum: number, post: any) => sum + (post._count?.comments || 0), 0),
    totalCommunities: new Set(posts.map((post: any) => post.community?.id).filter(Boolean)).size
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <MessageSquare className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
            Community Feed
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover the latest discussions and announcements from all communities
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{stats.totalPosts}</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Hash className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Total Comments</p>
                  <p className="text-2xl font-bold text-white">{stats.totalComments}</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Communities</p>
                  <p className="text-2xl font-bold text-white">{stats.totalCommunities}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="p-4 bg-gray-700/50 rounded-2xl mb-4">
                  <MessageSquare className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                <p className="text-gray-400 text-center max-w-sm mb-6">
                  Be the first to start a discussion in one of the communities
                </p>
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Featured Post (First Post) */}
              {posts.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    <h2 className="text-lg font-semibold text-orange-400">Featured Post</h2>
                  </div>
                  <PostCard 
                    key={posts[0].id} 
                    post={{
                      ...posts[0],
                      createdAt: posts[0].createdAt.toISOString(),
                      author: {
                        ...posts[0].author,
                        name: posts[0].author.name || "Anonymous"
                      }
                    }}

                  />
                </div>
              )}

              {/* Recent Posts */}
              {posts.length > 1 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
                    <span className="text-sm text-gray-400 ml-2">
                      {posts.length - 1} more posts
                    </span>
                  </div>
                  <div className="space-y-4">
                    {posts.slice(1).map((post: any) => (
                      <PostCard 
                        key={post.id} 
                        post={{
                          ...post,
                          createdAt: post.createdAt.toISOString(),
                          author: {
                            ...post.author,
                            name: post.author.name || "Anonymous"
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {posts.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Showing {posts.length} posts from {stats.totalCommunities} communities
            </p>
          </div>
        )}
      </div>
    </div>
  );
}