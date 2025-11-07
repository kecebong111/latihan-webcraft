"use server"

import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { signIn } from "@/lib/auth"

export async function register(email: string, password: string, name: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    throw new Error("User already exists")
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
      name,
    }
  })

  return user
}

export async function login(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: "Invalid credentials" }
  }
}

export async function logout() {
  // This will be handled by NextAuth on the client side
}