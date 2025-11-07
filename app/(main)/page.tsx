import { getFeedPosts } from "@/actions/post"
import PostCard from "@/components/feed/post-card"
import SearchBar from "@/components/feed/search-bar"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth()
  const posts = session?.user?.id ? await getFeedPosts(session.user.id) : { posts: [], total: 0 }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <SearchBar />
      </div>
      
      <div className="space-y-4">
        {posts.posts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">
              {session ? "No posts yet" : "Welcome to Gamanitas"}
            </h3>
            <p className="text-muted-foreground">
              {session 
                ? "Follow some communities to see posts in your feed"
                : "Please login to see posts from communities you follow"
              }
            </p>
          </div>
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
