"use client"
 
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBoardPost, getAllCommunitiesForAdmin } from "@/actions/admin"
import { MessageSquare, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Community {
  id: string
  name: string
  slug: string
}

export default function CreatePostPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [communityId, setCommunityId] = useState("")
  const [communities, setCommunities] = useState<Community[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCommunitiesLoading, setIsCommunitiesLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (session && (session.user as any)?.role === "ADMIN") {
      getAllCommunitiesForAdmin().then((data) => {
        setCommunities(data)
        setIsCommunitiesLoading(false)
      })
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Client-side validation
    if (!title.trim()) {
      setError("Post title is required")
      setIsLoading(false)
      return
    }

    if (title.trim().length < 5) {
      setError("Post title must be at least 5 characters")
      setIsLoading(false)
      return
    }

    if (title.trim().length > 200) {
      setError("Post title must be less than 200 characters")
      setIsLoading(false)
      return
    }

    if (!content.trim()) {
      setError("Post content is required")
      setIsLoading(false)
      return
    }

    if (content.trim().length < 10) {
      setError("Post content must be at least 10 characters")
      setIsLoading(false)
      return
    }

    if (content.length > 10000) {
      setError("Post content must be less than 10,000 characters")
      setIsLoading(false)
      return
    }

    if (!communityId) {
      setError("Please select a community")
      setIsLoading(false)
      return
    }

    try {
      await createBoardPost(title.trim(), content.trim(), communityId, session?.user?.id || "")
      router.push("/admin/posts?message=Board post created successfully")
    } catch (error: any) {
      setError(error.message || "Failed to create post")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-muted-foreground">
          You need admin privileges to access this page.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/posts">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Create Board Post
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="community">Community *</Label>
              <p className="text-sm text-muted-foreground">
                Select the community for this post
              </p>
              <select
                id="community"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                required
                disabled={isCommunitiesLoading}
              >
                <option value="">Choose a community...</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name} (c/{community.slug})
                  </option>
                ))}
              </select>
              {isCommunitiesLoading && (
                <p className="text-xs text-muted-foreground">
                  Loading communities...
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Post Title *</Label>
              <p className="text-sm text-muted-foreground">
                Catchy title for your post
              </p>
              <Input
                id="title"
                type="text"
                placeholder="Enter an engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/200 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Post Content *</Label>
              <p className="text-sm text-muted-foreground">
                Main content of your post
              </p>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                maxLength={10000}
                rows={16}
              />
              <p className="text-xs text-muted-foreground">
                {content.length}/10,000 characters
              </p>
            </div>
            
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading || isCommunitiesLoading}
              className="w-full"
            >
              {isLoading ? "Creating Post..." : "Create Board Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}