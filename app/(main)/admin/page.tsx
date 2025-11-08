"use client"

import { useSession } from "next-auth/react"
import { Users, MessageSquare, Hash } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { data: session } = useSession()

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
    <div className="w-full font-sans bg-gray-900 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <Button asChild>
          <Link href="/">Go Back to Home</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2 text-white">Manage Users</h2>
              <p className="text-sm text-muted-foreground">
                View, activate, or suspend user accounts
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/communities">
          <Card className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Hash className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2 text-white">Manage Communities</h2>
              <p className="text-sm text-muted-foreground">
                Create and manage community settings
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/posts">
          <Card className="bg-gray-800 border-gray-700 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2 text-white">Manage Posts</h2>
              <p className="text-sm text-muted-foreground">
                Review, suspend, or delete posts
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}