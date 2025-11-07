"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getAllUsersForAdmin, suspendUser, activateUser } from "@/actions/admin"
import { Ban, CheckCircle, Mail, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminUser {
  id: string
  email: string
  name?: string | null
  role: string
  status: string
  createdAt: string | Date
  _count: {
    posts: number
    comments: number
  }
}

export default function AdminUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session && (session.user as any)?.role === "ADMIN") {
      getAllUsersForAdmin().then((data) => {
        setUsers(data)
        setLoading(false)
      })
    }
  }, [session])

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    if (currentStatus === "ACTIVE") {
      await suspendUser(userId)
    } else {
      await activateUser(userId)
    }
    
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE" }
        : user
    ))
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
            <CardTitle>Manage Users</CardTitle>
            <div className="text-sm text-muted-foreground">
              {users.length} total users
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{user.name || "No name"}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "ADMIN" ? "secondary" : "default"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user._count.posts}</TableCell>
                  <TableCell>{user._count.comments}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant={user.status === "ACTIVE" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      disabled={user.role === "ADMIN"}
                    >
                      {user.status === "ACTIVE" ? (
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}