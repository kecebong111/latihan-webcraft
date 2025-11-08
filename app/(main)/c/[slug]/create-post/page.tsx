import { getCommunityBySlug, isUserFollowingCommunity } from "@/actions/community"
import { createPost } from "@/actions/post"
import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { ArrowLeft, Save, Image as ImageIcon, Sparkles, Zap, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Back Button */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            asChild 
            className="group hover:bg-gray-700/50 transition-all duration-300 border border-gray-700 hover:border-gray-600 rounded-xl px-4 py-2"
          >
            <Link href={`/c/${slug}`} className="flex items-center gap-2 text-gray-300 hover:text-white">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to c/{slug}
            </Link>
          </Button>
        </div>
        
        {/* Enhanced Main Card */}
        <Card className="border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl relative overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/5" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/15 to-transparent rounded-full translate-y-12 -translate-x-12" />
          
          <CardHeader className="relative z-10 pb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                <FileText className="h-6 w-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Create Post
                </CardTitle>
                <CardDescription className="text-lg text-gray-400 mt-2">
                  Share your thoughts with the{" "}
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 ml-1">
                    {community.name}
                  </Badge>{" "}
                  community
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                <Sparkles className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-green-300">New Post</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="relative z-10">
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
                const bytes = await imageFile.arrayBuffer()
                const buffer = Buffer.from(bytes)
                
                const timestamp = Date.now()
                const originalName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')
                const filename = `${timestamp}_${originalName}`
                
                try {
                  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
                  await fs.mkdir(uploadsDir, { recursive: true })
                  await fs.writeFile(path.join(uploadsDir, filename), buffer)
                  imageUrl = `/uploads/${filename}`
                } catch (error) {
                  console.error("Failed to save image:", error)
                }
              }

              await createPost(title, content, session.user.id, community.id, false, imageUrl)
              redirect(`/c/${slug}`)
            }} className="grid gap-8">
              
              {/* Title Field */}
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <Label htmlFor="title" className="text-lg font-semibold text-white">
                    Title
                  </Label>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all duration-300" />
                </div>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Craft an engaging title for your post..."
                  required
                  maxLength={200}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 py-6 text-lg rounded-2xl border-2 focus:shadow-lg focus:shadow-blue-500/10"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Make it catchy and descriptive
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-mono">200</span> characters max
                  </p>
                </div>
              </div>

              {/* Content Field */}
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <Label htmlFor="content" className="text-lg font-semibold text-white">
                    Content
                  </Label>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-green-500/50 group-hover:to-emerald-500/50 transition-all duration-300" />
                </div>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Share your thoughts, ideas, or questions with the community..."
                  required
                  maxLength={2000}
                  rows={10}
                  className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:ring-green-500/20 transition-all duration-300 resize-none rounded-2xl border-2 focus:shadow-lg focus:shadow-green-500/10 text-base leading-relaxed"
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Be clear and engaging with your content
                  </p>
                  <p className="text-xs text-gray-400">
                    <span className="font-mono">2000</span> characters max
                  </p>
                </div>
              </div>

              {/* Image Upload Field */}
              <div className="group">
                <div className="flex items-center gap-2 mb-3">
                  <Label htmlFor="image" className="text-lg font-semibold text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-blue-400" />
                    Image
                  </Label>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-700 to-gray-600 group-hover:from-purple-500/50 group-hover:to-pink-500/50 transition-all duration-300" />
                </div>
                
                <div className="relative">
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="bg-gray-800/50 border-gray-700 text-white file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:border-0 file:text-white file:font-medium file:px-4 file:py-2 file:rounded-xl file:mr-4 file:cursor-pointer hover:file:from-blue-700 hover:file:to-purple-700 transition-all duration-300 rounded-2xl border-2 cursor-pointer focus:border-purple-500 focus:ring-purple-500/20 focus:shadow-lg focus:shadow-purple-500/10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 tooltip" data-tip="4:3 ratio works best (standard phone camera)">
                    <ImageIcon className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    Optional: Add a visual to your post
                  </p>
                  <p className="text-xs text-gray-400">
                    4:3 ratio recommended
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50">
                <Button 
                  type="button" 
                  variant="outline" 
                  asChild
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-all duration-300 rounded-xl px-8 py-3 font-medium"
                >
                  <Link href={`/c/${slug}`}>
                    Cancel
                  </Link>
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 rounded-xl px-8 py-3 font-medium group"
                >
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Save className="h-5 w-5 transition-transform group-hover:scale-110" />
                      <Zap className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-semibold">Publish Post</span>
                  </div>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-8 border-0 bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Posting Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <span>Keep your title clear and attention-grabbing</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <span>Be respectful and follow community guidelines</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <span>Use images to make your post more engaging</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                <span>Check for spelling and grammar before posting</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}