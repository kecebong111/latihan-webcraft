"use client"

import { useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { uploadAvatar } from "@/actions/upload"

interface AvatarUploadProps {
  currentAvatar: string | null
  onAvatarChange: (newAvatarUrl: string) => void
}

export function AvatarUpload({ currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const { data: session, update } = useSession()
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      alert('Please select a file first')
      return
    }

    const file = fileInputRef.current.files[0]

    // Validate file before upload
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    setIsUploading(true)

    try {
      // Read file as base64
      const reader = new FileReader()

      reader.onloadend = async () => {
        const base64Data = reader.result as string

        // Call server action with base64 data
        const result = await uploadAvatar(base64Data, file.type)

        if (result.success && result.avatarUrl) {
          onAvatarChange(result.avatarUrl)
          setPreview(null)

          // Update session with new avatar
          try {
            await update({
              avatar: result.avatarUrl,
            })
            alert("Avatar updated successfully!")
          } catch (sessionError) {
            alert("Avatar saved but session update failed. Please refresh the page.")
          }
        } else {
          alert(result.error || "Failed to update avatar.")
        }

        setIsUploading(false)
      }

      reader.onerror = () => {
        alert("Failed to read file.")
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    } catch (error) {
      alert("Failed to update avatar.")
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
          <AvatarImage src={preview || currentAvatar || ""} alt="User avatar" />
          <AvatarFallback>
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </AvatarFallback>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
              Change
            </div>
          </div>
        </Avatar>
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