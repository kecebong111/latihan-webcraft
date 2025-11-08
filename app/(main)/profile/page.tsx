"use client"

import { useSession } from "next-auth/react"
import { getUserById } from "@/actions/user"
import { useEffect, useState } from "react"
import { Mail, Calendar, User, Shield, Key, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { ChangePasswordModal } from "@/components/profile/change-password-modal"
import { updateUserProfile } from "@/actions/user"
import { useRouter } from "next/navigation"

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
  const { data: session, update } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [editName, setEditName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)


  useEffect(() => {
    if (session?.user?.id) {
      getUserById(session.user.id).then((data) => {
        setProfile(data)
        setEditName(data?.name || "")
        setLoading(false)
      })
    }
  }, [session?.user?.id])



  const handleAvatarChange = (newAvatarUrl: string) => {
    if (profile) {
      setProfile({ ...profile, avatar: newAvatarUrl })
    }
  }

  const handleSaveChanges = async () => {
    if (!session?.user?.id) return
    
    setIsSaving(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    
    const result = await updateUserProfile(session.user.id, { name: editName })
    
    if (result.success) {
      if (profile) {
        setProfile({ ...profile, name: editName })
      }
      // Update session to reflect changes
      await update({ name: editName })
      setSuccessMessage("Profile updated successfully!")
    } else {
      setErrorMessage(`Failed to update profile: ${result.error}`)
    }
    setIsSaving(false)
  }

  const handleBackHome = () => {
    router.push("/")
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center py-12 max-w-md mx-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Please Login</h2>
            <p className="text-gray-400 mb-6">Sign in to view and manage your profile</p>
            <Button 
              onClick={() => router.push("/auth/signin")} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
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
          <p className="text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBackHome}
            className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Button>
          <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                <p className="text-gray-400">Manage your personal details and preferences</p>
              </div>
              
               <div className="p-6">

                 
                 <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <AvatarUpload
                      currentAvatar={profile?.avatar || null}
                      onAvatarChange={handleAvatarChange}
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Display Name
                      </label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-lg font-semibold bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your display name"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="font-medium">{profile?.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span>Joined {new Date(profile?.createdAt || "").toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-700 rounded-xl bg-gray-750">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <div className="text-sm font-medium text-gray-300">Role</div>
                      </div>
                      <div className="text-lg font-semibold capitalize text-white">
                        {profile?.role?.toLowerCase()}
                      </div>
                    </div>
                    
                    <div className="p-4 border border-gray-700 rounded-xl bg-gray-750">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-3 h-3 rounded-full ${profile?.status === "ACTIVE" ? "bg-green-500" : "bg-yellow-500"}`} />
                        <div className="text-sm font-medium text-gray-300">Status</div>
                      </div>
                      <div className={`text-lg font-semibold capitalize ${
                        profile?.status === "ACTIVE" ? "text-green-400" : "text-yellow-400"
                      }`}>
                        {profile?.status?.toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Cards */}
          <div className="space-y-6">
            {/* Password Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Key className="w-6 h-6 text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Security</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Password</div>
                  <div className="text-lg font-mono text-gray-300">••••••••</div>
                </div>
                
                <Button 
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                >
                  Change Password
                </Button>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>

              <div className="space-y-3">
                 <Button
                   onClick={handleSaveChanges}
                   disabled={isSaving || !editName.trim()}
                   className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:bg-gray-600"
                 >
                   {isSaving ? (
                     <>
                       <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                       Saving...
                     </>
                   ) : (
                     "Save Changes"
                   )}
                 </Button>

                 {/* Success/Error Messages */}
                 {successMessage && (
                   <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/50">
                     <p className="text-green-400 text-sm text-center">{successMessage}</p>
                   </div>
                 )}
                 {errorMessage && (
                   <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50">
                     <p className="text-red-400 text-sm text-center">{errorMessage}</p>
                   </div>
                 )}

                 <Button
                   variant="outline"
                   onClick={() => window.location.reload()}
                   className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                 >
                   Refresh Page
                 </Button>

                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  )
}