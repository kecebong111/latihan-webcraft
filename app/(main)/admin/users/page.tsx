"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getAllUsersForAdmin, suspendUser, activateUser } from "@/actions/admin"
import { Ban, CheckCircle, Mail, Calendar, Shield, Users, ArrowLeft, Home } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

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
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (session && (session.user as any)?.role === "ADMIN") {
      getAllUsersForAdmin().then((data) => {
        setUsers(data)
        setLoading(false)
      })
    }
  }, [session])

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    setProcessing(userId)
    try {
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
    } finally {
      setProcessing(null)
    }
  }

  const handleBackHome = () => {
    router.push("/")
  }

  const stats = {
    total: users.length,
    active: users.filter(user => user.status === "ACTIVE").length,
    suspended: users.filter(user => user.status === "SUSPENDED").length,
    admins: users.filter(user => user.role === "ADMIN").length
  }

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
            <p className="text-gray-400 mb-6">Administrator privileges required</p>
            <Button 
              onClick={handleBackHome}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-400">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBackHome}
            className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-green-400">{stats.active}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Suspended</p>
                  <p className="text-2xl font-bold text-red-400">{stats.suspended}</p>
                </div>
                <Ban className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Admins</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.admins}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">All Users</CardTitle>
              <div className="text-sm text-gray-400">
                {users.length} total users
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700 hover:bg-gray-750">
                  <TableHead className="text-gray-300 font-medium">User</TableHead>
                  <TableHead className="text-gray-300 font-medium">Role</TableHead>
                  <TableHead className="text-gray-300 font-medium">Status</TableHead>
                  <TableHead className="text-gray-300 font-medium">Posts</TableHead>
                  <TableHead className="text-gray-300 font-medium">Comments</TableHead>
                  <TableHead className="text-gray-300 font-medium">Joined</TableHead>
                  <TableHead className="text-gray-300 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-750">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                          <span className="text-sm font-medium text-white">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-white">{user.name || "No name"}</div>
                          <div className="text-sm text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.role === "ADMIN" ? "secondary" : "default"}
                        className={user.role === "ADMIN" ? "bg-purple-600 text-white" : "bg-gray-600 text-white"}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={user.status === "ACTIVE" ? "default" : "destructive"}
                        className={user.status === "ACTIVE" ? "bg-green-600 text-white" : "bg-red-600 text-white"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-white font-medium">{user._count.posts}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-white font-medium">{user._count.comments}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={user.status === "ACTIVE" ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        disabled={user.role === "ADMIN" || processing === user.id}
                        className={
                          user.status === "ACTIVE" 
                            ? "bg-red-600 hover:bg-red-700 text-white" 
                            : "bg-green-600 hover:bg-green-700 text-white"
                        }
                      >
                        {processing === user.id ? (
                          <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : user.status === "ACTIVE" ? (
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
    </div>
  )
}