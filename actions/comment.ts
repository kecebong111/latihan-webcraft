"use server"

import { prisma } from "@/lib/db"

export async function createComment(text: string, authorId: string, postId: string) {
  return await prisma.comment.create({
    data: {
      text,
      authorId,
      postId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      }
    }
  })
}

export async function getPostComments(postId: string) {
  return await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      }
    },
    orderBy: { createdAt: "asc" }
  })
}

export async function deleteComment(commentId: string) {
  return await prisma.comment.delete({
    where: { id: commentId }
  })
}