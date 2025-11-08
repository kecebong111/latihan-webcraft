"use server"

import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { updateUserAvatar } from "./user"

export async function uploadAvatar(base64Data: string, fileType: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  if (!base64Data) {
    return { success: false, error: "No file provided" }
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  if (!allowedTypes.includes(fileType)) {
    return { success: false, error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." }
  }

  try {
    // Remove data URL prefix if present (e.g., "data:image/png;base64,")
    const base64String = base64Data.includes(',') ? base64Data.split(',')[1] : base64Data

    // Convert base64 to buffer
    const buffer = Buffer.from(base64String, 'base64')

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (buffer.length > maxSize) {
      return { success: false, error: "File too large. Maximum size is 5MB." }
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "photos", "avatars")
    await mkdir(uploadsDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = fileType.split("/")[1]
    const filename = `${session.user.id}-${timestamp}.${fileExtension}`
    const filepath = join(uploadsDir, filename)

    // Save file
    await writeFile(filepath, buffer)

    // Create URL that will be stored in database
    const avatarUrl = `/photos/avatars/${filename}`

    // Update user's avatar in database
    await updateUserAvatar(session.user.id, avatarUrl)

    return {
      success: true,
      avatarUrl,
      message: "Avatar uploaded successfully"
    }

  } catch (error) {
    return { success: false, error: `Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}` }
  }
}