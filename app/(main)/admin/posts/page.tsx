"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { getAllPostsForAdmin, suspendPost, activatePost, deletePostAdmin } from "@/actions/admin"
import { MessageSquare, Ban, CheckCircle, Trash2, Pin } from "lucide-react"
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
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [loading, setLoading] = useState(true)
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
  }

  const handleDelete = async (postId: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePostAdmin(postId)
      setPosts(posts.filter(post => post.id !== postId))
      setTotal(total - 1)
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
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Manage Posts</CardTitle>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/admin/posts/create">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Create Board Post
                </Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                {total} total posts
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">
                        {post.community.name}
                      </Badge>
                      {post.isBoardPost && (
                        <Badge variant="secondary">
                          <Pin className="w-3 h-3 mr-1" />
                          Board Post
                        </Badge>
                      )}
                      <Badge variant={post.status === "ACTIVE" ? "default" : "destructive"}>
                        {post.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={post.status === "ACTIVE" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleStatusChange(post.id, post.status)}
                      >
                        {post.status === "ACTIVE" ? (
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                      by {post.author.name || "Anonymous"} • {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      {post._count.comments} comments
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}