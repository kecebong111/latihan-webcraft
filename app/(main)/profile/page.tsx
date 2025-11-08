"use client"

import { useSession } from "next-auth/react"
import { getUserById } from "@/actions/user"
import { useEffect, useState } from "react"
import { Mail, Calendar } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Import Input
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { ChangePasswordModal } from "@/components/profile/change-password-modal"
import { updateUserProfile } from "@/actions/user" // Will create this next

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [editName, setEditName] = useState("") // State for editable name

  useEffect(() => {
    if (session?.user?.id) {
      getUserById(session.user.id).then((data) => {
        setProfile(data)
        setEditName(data?.name || "") // Initialize editName
        setLoading(false)
      })
    }
  }, [session])

  const handleAvatarChange = (newAvatarUrl: string) => {
    if (profile) {
      setProfile({ ...profile, avatar: newAvatarUrl })
    }
  }

  const handleSaveChanges = async () => {
    if (!session?.user?.id) return
    // For now, only name is editable. Extend this for other fields later.
    const result = await updateUserProfile(session.user.id, { name: editName })
    if (result.success) {
      alert("Profile updated successfully!")
      if (profile) {
        setProfile({ ...profile, name: editName })
      }
    } else {
      alert(`Failed to update profile: ${result.error}`)
    }
  }

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
          <AvatarUpload
            userId={profile?.id as string}
            currentAvatar={profile?.avatar || null}
            onAvatarChange={handleAvatarChange}
          />
          
          <div>
            <Input
              id="name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="text-xl font-semibold mb-1"
            />
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

          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium text-muted-foreground">Password</div>
            <div className="text-lg">********</div>
            <Button variant="link" className="p-0 h-auto" onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}