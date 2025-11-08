"use server"

import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { updateUserAvatar } from "@/actions/user"

export async function uploadAvatar(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { error: "Unauthorized" }
  }

  const file = formData.get("file") as File

  if (!file) {
    return { error: "No file provided" }
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(file.type)) {
    return { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." }
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { error: "File too large. Maximum size is 5MB." }
  }

  try {
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "photos", "avatars")
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.type.split("/")[1]
    const filename = `${session.user.id}-${timestamp}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    console.log("File details:", {
      originalName: file.name,
      type: file.type,
      size: file.size,
      filename,
      filepath,
    })

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)
    console.log("File saved successfully to:", filepath)

    // Create URL that will be stored in database
    const avatarUrl = `/photos/avatars/${filename}`
    console.log("Generated avatar URL:", avatarUrl)

    // Update user's avatar in database
    console.log("Updating user avatar in database:", avatarUrl)
    await updateUserAvatar(session.user.id, avatarUrl)
    console.log("Database updated successfully")

    return { 
      success: true, 
      avatarUrl,
      message: "Avatar uploaded successfully" 
    }

  } catch (error) {
    console.error("Error uploading avatar:", error)
    return { error: "Failed to upload avatar" }
  }
}