"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createCommunity } from "@/actions/community"
import { Hash, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CreateCommunityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [icon, setIcon] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Client-side validation
    if (!name.trim()) {
      setError("Community name is required")
      setIsLoading(false)
      return
    }

    if (name.trim().length < 3) {
      setError("Community name must be at least 3 characters")
      setIsLoading(false)
      return
    }

    if (name.trim().length > 50) {
      setError("Community name must be less than 50 characters")
      setIsLoading(false)
      return
    }

    const slug = generateSlug(name)
    if (slug.length < 3) {
      setError("Community name is too short")
      setIsLoading(false)
      return
    }

    if (description && description.length > 500) {
      setError("Description must be less than 500 characters")
      setIsLoading(false)
      return
    }

    if (icon && !isValidUrl(icon)) {
      setError("Please enter a valid URL for the icon")
      setIsLoading(false)
      return
    }

    try {
      const slug = generateSlug(name)
      await createCommunity(name, slug, description || "", session?.user?.id || "", icon || undefined)
      router.push("/admin/communities?message=Community created successfully")
    } catch (error: any) {
      setError(error.message || "Failed to create community")
    } finally {
      setIsLoading(false)
    }
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/communities">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Communities
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Hash className="w-6 h-6" />
            Create New Community
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Community Name *</Label>
              <p className="text-sm text-muted-foreground">
                This will be displayed as community title
              </p>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Technology, Gaming, Books"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
              />
              <p className="text-xs text-muted-foreground">
                {name.length}/50 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Community Slug</Label>
              <p className="text-sm text-muted-foreground">
                URL-friendly version of name
              </p>
              <div className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm">
                c/{generateSlug(name)}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <p className="text-sm text-muted-foreground">
                Optional: Brief description of your community
              </p>
              <Textarea
                id="description"
                placeholder="A community for discussing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Icon URL</Label>
              <p className="text-sm text-muted-foreground">
                Optional: URL to community icon image
              </p>
              <Input
                id="icon"
                type="url"
                placeholder="https://example.com/icon.png"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />
            </div>
            
            {error && (
              <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                {error}
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Community..." : "Create Community"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}