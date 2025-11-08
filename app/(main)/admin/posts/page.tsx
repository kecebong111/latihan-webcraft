"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getAllPostsForAdmin, suspendPost, activatePost, deletePostAdmin } from "@/actions/admin"
import { MessageSquare, Ban, CheckCircle, Trash2, Pin, Home, Eye, User, Calendar, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdminPost {
  id: string
  title: string
  content: string
  status: string
  isBoardPost: boolean
  createdAt: string | Date
  author: {
    id: string
    name?: string | null
  }
  community: {
    id: string
    name: string
    slug: string
  }
  _count: {
    comments: number
  }
}

export default function AdminPostsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (session && (session.user as any)?.role === "ADMIN") {
      getAllPostsForAdmin(page).then((data) => {
        setPosts(data.posts)
        setTotal(data.total)
        setLoading(false)
      })
    }
  }, [session, page])

  const handleStatusChange = async (postId: string, currentStatus: string) => {
    setProcessing(postId)
    try {
      if (currentStatus === "ACTIVE") {
        await suspendPost(postId)
      } else {
        await activatePost(postId)
      }
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, status: currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
          : post
      ))
    } catch (error) {
      console.error("Failed to update post status:", error)
    } finally {
      setProcessing(null)
    }
  }

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      setProcessing(postId)
      try {
        await deletePostAdmin(postId)
        setPosts(posts.filter(post => post.id !== postId))
        setTotal(total - 1)
      } catch (error) {
        console.error("Failed to delete post:", error)
      } finally {
        setProcessing(null)
      }
    }
  }

  const handleBackHome = () => {
    router.push("/")
  }

  const stats = {
    total: total,
    active: posts.filter(post => post.status === "ACTIVE").length,
    suspended: posts.filter(post => post.status === "SUSPENDED").length,
    boardPosts: posts.filter(post => post.isBoardPost).length
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <Ban className="w-16 h-16 text-red-400 mx-auto mb-4" />
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading posts...</p>
        </div>
      </div>
    )
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
            <h1 className="text-3xl font-bold text-white">Post Management</h1>
            <p className="text-gray-400">Manage and moderate all community posts</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Posts</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Suspended</p>
                  <p className="text-2xl font-bold text-red-400">{stats.suspended}</p>
                </div>
                <Ban className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Board Posts</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.boardPosts}</p>
                </div>
                <Pin className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">All Posts</CardTitle>
              <div className="flex items-center gap-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/admin/posts/create" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Create Board Post
                  </Link>
                </Button>
                <div className="text-sm text-gray-400">
                  {total} total posts
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {posts.map((post) => (
                <Card key={post.id} className="bg-gray-750 border-gray-700 hover:border-gray-600 transition-colors">
                  <CardContent className="p-6">
                    {/* Header with badges and actions */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                          {post.community.name}
                        </Badge>
                        {post.isBoardPost && (
                          <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                            <Pin className="w-3 h-3 mr-1" />
                            Board Post
                          </Badge>
                        )}
                        <Badge className={
                          post.status === "ACTIVE" 
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-red-600 text-white hover:bg-red-700"
                        }>
                          {post.status}
                        </Badge>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          <Link href={`/c/${post.community.slug}/post/${post.id}`} className="flex items-center gap-2">
                            <Eye className="w-3 h-3" />
                            View
                          </Link>
                        </Button>
                        
                        <Button
                          variant={post.status === "ACTIVE" ? "destructive" : "default"}
                          size="sm"
                          onClick={() => handleStatusChange(post.id, post.status)}
                          disabled={processing === post.id}
                          className={
                            post.status === "ACTIVE" 
                              ? "bg-red-600 hover:bg-red-700 text-white" 
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }
                        >
                          {processing === post.id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : post.status === "ACTIVE" ? (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Activate
                            </>
                          )}
                        </Button>
                        
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          disabled={processing === post.id}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          {processing === post.id ? (
                            <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Post Content */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                      <p className="text-gray-300 line-clamp-3">
                        {post.content}
                      </p>
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{post.author.name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span>{post._count.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-400 mb-2">No posts found</h3>
                  <p className="text-gray-500 mb-4">There are no posts to manage at the moment</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Link href="/admin/posts/create" className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Create Board Post
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}