"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { MonogramAvatar } from "@/components/ui/monogram-avatar"
import { uploadAvatar } from "@/actions/upload"

interface AvatarUploadProps {
  currentAvatar: string | null
  onAvatarChange: (newAvatarUrl: string) => void
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { update, data: session } = useSession()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      console.log('No file selected')
      return
    }

    const file = fileInputRef.current.files[0]
    console.log('Selected file:', file)
    
    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      console.log('Starting avatar upload with server action...')
      const result = await uploadAvatar(formData)
      console.log('Upload result:', result)

      if (result.success && result.avatarUrl) {
        console.log('Upload successful, updating UI...')
        onAvatarChange(result.avatarUrl)
        setPreview(null) // Clear preview after upload
        
        // Update session with new avatar
        console.log('Updating session with avatar:', result.avatarUrl)
        try {
          const updateResult = await update({ 
            avatar: result.avatarUrl,
          })
          console.log('Session update result:', updateResult)
          
          alert("Avatar updated successfully!")
        } catch (sessionError) {
          console.error('Session update failed:', sessionError)
        }
      } else {
        console.error('Upload failed:', result)
        alert(result.error || "Failed to update avatar.")
      }
    } catch (error) {
      console.error("Failed to update avatar:", error)
      alert("Failed to update avatar.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="relative group">
        <Avatar className="w-24 h-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
          {preview || currentAvatar ? (
            <AvatarImage src={preview || currentAvatar || undefined} alt="Profile Avatar" />
          ) : (
            <AvatarFallback className="bg-gray-500 text-white">
              {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : "U"}
            </AvatarFallback>
          )}
        </Avatar>
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-white text-sm">Change</span>
        </div>
      </div>
      
      {preview && (
        <Button 
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
              Uploading...
            </>
          ) : (
            "Upload New Avatar"
          )}
        </Button>
      )}
    </div>
  )
}