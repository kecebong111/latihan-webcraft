import { searchPosts } from "@/actions/post"
import PostCard from "@/components/feed/post-card"
import { Search } from "lucide-react"
import { auth } from "@/lib/auth"
import { Button } from "@/components/ui/button"

interface SearchPageProps {
  searchParams: {
    q?: string
    page?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams
  const query = resolvedSearchParams.q || ""
  const page = parseInt(resolvedSearchParams.page || "1")
  const session = await auth()
  
  if (!query) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-2">Search for posts</h2>
        <p className="text-muted-foreground">
          Use the search bar above to find posts, communities, and topics
        </p>
      </div>
    )
  }

  const posts = await searchPosts(query, session?.user?.id, page)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">
          Found {posts.total} posts
        </p>
      </div>
      
      <div className="space-y-4">
        {posts.posts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try searching with different keywords
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
      
      {posts.total > 10 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 && (
            <Button 
              variant="outline"
              asChild
            >
              <a href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}>
                Previous
              </a>
            </Button>
          )}
          
          <span className="px-3 py-1 text-sm font-medium">
            Page {page}
          </span>
          
          {posts.posts.length === 10 && (
            <Button 
              variant="outline"
              asChild
            >
              <a href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}>
                Next
              </a>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}