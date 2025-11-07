import Link from "next/link"
import { MessageCircle, Pin } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Post {
  id: string
  title: string
  content: string
  image?: string | null
  createdAt: string
  isBoardPost: boolean
  author: {
    id: string
    name: string
  }
  community: {
    id: string
    name: string
    slug: string
    icon?: string | null
  }
  _count: {
    comments: number
  }
}

export default function PostCard({ post }: { post: Post }) {
  const displayImage = post.image || post.community.icon

  return (
    <Card className="overflow-hidden">
      {displayImage && (
        <div className="aspect-[4/3] w-full">
          <img 
            src={displayImage} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <Link 
            href={`/c/${post.community.slug}`}
            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            {post.community.name}
          </Link>
          <div className="flex items-center gap-2">
            {post.isBoardPost && (
              <Pin className="h-4 w-4 text-yellow-600" />
            )}
            <span className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <Link href={`/post/${post.id}`} className="block group">
          <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {post.content}
          </p>
        </Link>
      </CardContent>
      
      <CardFooter className="pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src="" alt={post.author.name} />
              <AvatarFallback className="text-xs">
                {post.author.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {post.author.name}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MessageCircle className="h-4 w-4" />
            {post._count.comments}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}