"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createBoardPost, getAllCommunitiesForAdmin } from "@/actions/admin"
import { MessageSquare, ArrowLeft, Home, Users, FileText, Hash } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

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

  const handleBackHome = () => {
    router.push("/")
  }

  const selectedCommunity = communities.find(c => c.id === communityId)

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <MessageSquare className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">Administrator privileges required</p>
            <Button 
              onClick={handleBackHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
            <h1 className="text-3xl font-bold text-white">Create Board Post</h1>
            <p className="text-gray-400">Create an official board post for a community</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-400" />
                  Post Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Community Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="community" className="text-white font-medium">
                      Community *
                    </Label>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Users className="w-4 h-4" />
                      Select the community for this post
                    </div>
                    <select
                      id="community"
                      className="flex h-12 w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                      value={communityId}
                      onChange={(e) => setCommunityId(e.target.value)}
                      required
                      disabled={isCommunitiesLoading}
                    >
                      <option value="" className="bg-gray-700">Choose a community...</option>
                      {communities.map((community) => (
                        <option key={community.id} value={community.id} className="bg-gray-700">
                          {community.name} (c/{community.slug})
                        </option>
                      ))}
                    </select>
                    {isCommunitiesLoading && (
                      <div className="flex items-center gap-2 text-sm text-blue-400">
                        <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent"></div>
                        Loading communities...
                      </div>
                    )}
                  </div>

                  {/* Title Input */}
                  <div className="space-y-3">
                    <Label htmlFor="title" className="text-white font-medium">
                      Post Title *
                    </Label>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Hash className="w-4 h-4" />
                      Catchy title for your post
                    </div>
                    <Input
                      id="title"
                      type="text"
                      placeholder="Enter an engaging title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      maxLength={200}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 h-12"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        Minimum 5 characters
                      </p>
                      <p className={`text-xs ${
                        title.length > 180 ? "text-red-400" : "text-gray-400"
                      }`}>
                        {title.length}/200 characters
                      </p>
                    </div>
                  </div>
                  
                  {/* Content Textarea */}
                  <div className="space-y-3">
                    <Label htmlFor="content" className="text-white font-medium">
                      Post Content *
                    </Label>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <FileText className="w-4 h-4" />
                      Main content of your post
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Write your post content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      required
                      maxLength={10000}
                      rows={12}
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-400">
                        Minimum 10 characters
                      </p>
                      <p className={`text-xs ${
                        content.length > 9500 ? "text-red-400" : "text-gray-400"
                      }`}>
                        {content.length}/10,000 characters
                      </p>
                    </div>
                  </div>
                  
                  {/* Error Message */}
                  {error && (
                    <div className="p-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/admin/posts")}
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || isCommunitiesLoading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:bg-gray-600"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                          Creating Post...
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Create Board Post
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            {/* Community Preview */}
            {selectedCommunity && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700 pb-4">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Selected Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {selectedCommunity.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {selectedCommunity.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        /c/{selectedCommunity.slug}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Post Preview */}
            {(title || content) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700 pb-4">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Post Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {title && (
                      <div>
                        <Badge className="bg-blue-600 text-white text-xs mb-2">
                          Title
                        </Badge>
                        <h3 className="text-white font-semibold text-sm">
                          {title}
                        </h3>
                      </div>
                    )}
                    {content && (
                      <div>
                        <Badge className="bg-green-600 text-white text-xs mb-2">
                          Content Preview
                        </Badge>
                        <p className="text-gray-300 text-sm line-clamp-4">
                          {content}
                        </p>
                      </div>
                    )}
                    {selectedCommunity && (
                      <div className="pt-2 border-t border-gray-700">
                        <Badge className="bg-purple-600 text-white text-xs">
                          Board Post
                        </Badge>
                        <p className="text-gray-400 text-xs mt-1">
                          This will be created as an official board post
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Guidelines */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700 pb-4">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ul className="space-y-2 text-xs text-gray-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Board posts are official announcements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Choose the appropriate community</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Write clear and concise content</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>Review before publishing</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}