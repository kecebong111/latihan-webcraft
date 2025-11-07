"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { createComment } from "@/actions/comment"
import { MessageCircle, Send } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Comment {
  id: string
  text: string
  createdAt: string | Date
  author: {
    id: string
    name: string | null
  }
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session) return

    // Validate comment length
    if (newComment.trim().length < 1) {
      setError("Comment cannot be empty")
      return
    }
    
    if (newComment.trim().length > 1000) {
      setError("Comment must be less than 1000 characters")
      return
    }

    setIsSubmitting(true)
    setError("")
    
    try {
      const comment = await createComment(newComment.trim(), session.user?.id || "", postId)
      setComments([comment, ...comments])
      setNewComment("")
    } catch (error: any) {
      setError(error.message || "Failed to post comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {session && (
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-3">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value)
                  if (error) setError("")
                }}
                maxLength={1000}
                rows={3}
                className="resize-none"
                required
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {newComment.length}/1000 characters
                </span>
                <Button
                  type="submit"
                  disabled={isSubmitting || !newComment.trim()}
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Comment
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="mt-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
          </form>
        )}
        
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-primary/20 pl-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {(comment.author.name || "U").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{comment.author.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}