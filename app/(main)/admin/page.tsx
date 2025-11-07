"use client"

import { useSession } from "next-auth/react"
import { Users, MessageSquare, Hash } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2">Manage Users</h2>
              <p className="text-sm text-muted-foreground">
                View, activate, or suspend user accounts
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/communities">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <Hash className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2">Manage Communities</h2>
              <p className="text-sm text-muted-foreground">
                Create and manage community settings
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/posts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <MessageSquare className="w-8 h-8 text-primary mb-4" />
              <h2 className="text-lg font-semibold mb-2">Manage Posts</h2>
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