import { getPostComments } from "@/actions/comment"
import { getPostById } from "@/actions/post"
import CommentSection from "@/components/post/comment-section"
import { MessageCircle, Calendar, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"

interface PageProps {
  params: {
    id: string
  }
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const [post, comments] = await Promise.all([
    getPostById(id),
    getPostComments(id)
  ])
  
  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="default">
              {post.community.name}
            </Badge>
            {post.isBoardPost && (
              <Badge variant="secondary">Board Post</Badge>
            )}
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author.name}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {comments.length} comments
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <p className="text-lg leading-relaxed">{post.content}</p>
          </div>
        </CardContent>
      </Card>
      
      <CommentSection postId={id} initialComments={comments.map((c: any) => ({
  ...c,
  createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : c.createdAt
  }))} />
    </div>
  )
}