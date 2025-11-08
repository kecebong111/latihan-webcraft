"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { updateUserAvatar } from "@/actions/user"
import { useSession } from "next-auth/react"

interface AvatarUploadProps {
  userId: string
  currentAvatar: string | null
  onAvatarChange: (newAvatarUrl: string) => void
}

export function AvatarUpload({ userId, currentAvatar, onAvatarChange }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { update } = useSession()

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
    if (!fileInputRef.current?.files?.[0]) return

    const file = fileInputRef.current.files[0]
    // In a real application, you would upload this file to a service like Cloudinary, S3, etc.
    // For this example, we'll simulate an upload and use a placeholder URL.
    // You would get a secure URL from your upload service.
    const simulatedUploadUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=${Math.random()}`

    try {
      await updateUserAvatar(userId, simulatedUploadUrl)
      onAvatarChange(simulatedUploadUrl)
      setPreview(null) // Clear preview after upload
      await update({ avatar: simulatedUploadUrl }) // Update session
      alert("Avatar updated successfully!")
    } catch (error) {
      console.error("Failed to update avatar:", error)
      alert("Failed to update avatar.")
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
          <AvatarImage src={preview || currentAvatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Profile Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-white text-sm">Change</span>
        </div>
      </div>
      
      {preview && (
        <Button onClick={handleUpload}>Upload New Avatar</Button>
      )}
    </div>
  )
}