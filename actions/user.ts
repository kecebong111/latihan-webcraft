"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      passwordHash: true, // Select passwordHash for comparison
    }
  })
}

export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED") {
  return await prisma.user.update({
    where: { id: userId },
    data: { status }
  })
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function updateUserAvatar(userId: string, avatarUrl: string) {
  try {
    const result = await prisma.user.update({
      where: { id: userId },
      data: { avatar: avatarUrl }
    })
    return result
  } catch (error) {
    throw error
  }
}

export async function updateUserPassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user || !user.passwordHash) {
    return { error: "User not found or password not set." }
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash)

  if (!isPasswordValid) {
    return { error: "Incorrect current password." }
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashedPassword }
  })

  return { success: "Password updated successfully." }
}

interface UpdateUserFields {
  name?: string | null;
  // Add other fields here as they become editable
}

export async function updateUserProfile(userId: string, fields: UpdateUserFields) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: fields,
    })
    return { success: "Profile updated successfully." }
  } catch (error: unknown) {
    console.error("Failed to update user profile:", error)
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile."
    return { error: errorMessage }
  }
}