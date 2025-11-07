import { getCommunityBySlug, isUserFollowingCommunity } from "@/actions/community"
import { createPost } from "@/actions/post"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import fs from 'fs/promises'
import path from 'path'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function CreatePostPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug
  const session = await auth()
  const community = await getCommunityBySlug(slug)
  
  if (!community) {
    notFound()
  }

  if (!session) {
    redirect("/login")
  }

  const isFollowing = session?.user?.id ? await isUserFollowingCommunity(session.user.id, community.id) : false
  
  if (!isFollowing) {
    redirect(`/c/${slug}`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/c/${slug}`} className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
          <ArrowLeft className="h-4 w-4" />
          Back to c/{slug}
        </Link>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Post in {community.name}</CardTitle>
          <CardDescription>
            Share your thoughts with the {community.name} community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={async (formData) => {
            "use server"
            
            const title = formData.get("title") as string
            const content = formData.get("content") as string
            const imageFile = formData.get("image") as File
            
            if (!title || !content) {
              throw new Error("Title and content are required")
            }

            const session = await auth()
            if (!session?.user?.id) {
              throw new Error("User not authenticated")
            }

            let imageUrl: string | undefined
            
            if (imageFile && imageFile.size > 0) {
              // For now, we'll use a simple approach to handle image upload
              // In production, you'd want to upload to a cloud storage service
              const bytes = await imageFile.arrayBuffer()
              const buffer = Buffer.from(bytes)
              
              // Create a simple filename based on timestamp and original name
              const timestamp = Date.now()
              const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
              const filename = `${timestamp}_${originalName}`
              
              // For now, we'll store in public/uploads directory
              // In production, use a proper file storage service
              try {
                const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
                
                // Ensure uploads directory exists
                await fs.mkdir(uploadsDir, { recursive: true })
                
                // Write file
                await fs.writeFile(path.join(uploadsDir, filename), buffer)
                imageUrl = `/uploads/${filename}`
              } catch (error) {
                console.error("Failed to save image:", error)
                // Continue without image if upload fails
              }
            }

            await createPost(title, content, session.user.id, community.id, false, imageUrl)
            redirect(`/c/${slug}`)
          }} className="grid gap-6">
            
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your post title..."
                required
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 200 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content..."
                required
                maxLength={2000}
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                Maximum 2000 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  className="flex-1"
                />
                <div className="tooltip" data-tip="4:3 ratio works best (standard phone camera)">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: Upload an image for your post (4:3 ratio recommended)
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href={`/c/${slug}`}>Cancel</Link>
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}