"use client"

import { useSession } from "next-auth/react"
import { getUserById } from "@/actions/user"
import { useEffect, useState } from "react"
import { Mail, Calendar } from "lucide-react"

interface UserProfile {
  id: string
  email: string
  name?: string | null
  avatar?: string | null
  role: string
  status: string
  createdAt: string | Date
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      getUserById(session.user.id).then((data) => {
        setProfile(data)
        setLoading(false)
      })
    }
  }, [session])

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
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
    <div className="max-w-2xl mx-auto">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-6">My Profile</h2>
        
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <img
              src={profile?.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold">{profile?.name || "No name"}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              {profile?.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Joined {new Date(profile?.createdAt || "").toLocaleDateString()}
            </div>
          </div>
        </div>
          
          <div className="divider"></div>
          
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Role</div>
            <div className="text-lg capitalize">
              {profile?.role?.toLowerCase()}
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div className={`text-lg capitalize ${
              profile?.status === "ACTIVE" ? "text-green-600" : "text-yellow-600"
            }`}>
              {profile?.status?.toLowerCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}