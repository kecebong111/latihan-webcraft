"use server"

import { prisma } from "@/lib/db"

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