"use server"

import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { updateUserAvatar } from "./user"

export async function uploadAvatar(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  const file = formData.get("file") as File

  if (!file) {
    return { success: false, error: "No file provided" }
  }

  // Simple validation
  if (!file.type.startsWith('image/')) {
    return { success: false, error: "Invalid file type. Only images are allowed." }
  }

  try {
    // Convert file to buffer (same as working post upload)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "photos", "avatars")
    await mkdir(uploadsDir, { recursive: true })

    // Generate simple filename (same pattern as working examples)
    const timestamp = Date.now()
    const fileExtension = file.type.split("/")[1]
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