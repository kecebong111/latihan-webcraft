import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { updateUserAvatar } from "@/actions/user"

export async function POST(request: NextRequest) {
  console.log("🧪 Test API route called")
  
  try {
    const session = await auth()
    console.log("📝 Session:", { userId: session?.user?.id, hasSession: !!session })
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    console.log("📁 File received:", { name: file?.name, size: file?.size, type: file?.type })
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simple test - just try to save the file
    const timestamp = Date.now()
    const fileExtension = file.type.split("/")[1]
    const filename = `${session.user.id}-${timestamp}.${fileExtension}`
    const uploadsDir = join(process.cwd(), "public", "photos", "avatars")
    const filepath = join(uploadsDir, filename)
    
    await mkdir(uploadsDir, { recursive: true })
    
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)
    
    console.log("✅ Test file saved successfully to:", filepath)
    
    // Test database update
    const avatarUrl = `/photos/avatars/${filename}`
    await updateUserAvatar(session.user.id, avatarUrl)
    console.log("✅ Test database update successful")
    
    return NextResponse.json({ 
      success: true, 
      message: "Test upload successful",
      avatarUrl,
      filepath
    })
    
  } catch (error) {
    console.error("💥 Test API error:", error)
    return NextResponse.json({ 
      error: "Test upload failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}