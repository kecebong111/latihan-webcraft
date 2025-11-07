"use server"

import { prisma } from "@/lib/db"
import { updateUserStatus } from "./user"
import { updatePostStatus, deletePost } from "./post"

export async function createBoardPost(title: string, content: string, communityId: string, authorId: string) {
  return await prisma.post.create({
    data: {
      title,
      content,
      authorId,
      communityId,
      isBoardPost: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
        }
      },
      community: {
        select: {
          id: true,
          name: true,
          slug: true,
        }
      }
    }
  })
}

export async function getAllUsersForAdmin() {
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      status: true,
      createdAt: true,
      _count: {
        select: {
          posts: true,
          comments: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function getAllCommunitiesForAdmin() {
  return await prisma.community.findMany({
    include: {
      creator: {
        select: {
          id: true,
          name: true,
        }
      },
      _count: {
        select: {
          follows: true,
          posts: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  })
}

export async function getAllPostsForAdmin(page = 1, limit = 20) {
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
          }
        },
        community: {
          select: {
            id: true,
            name: true,
            slug: true,
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.post.count()
  ])

  return { posts, total }
}

export async function suspendUser(userId: string) {
  return await updateUserStatus(userId, "SUSPENDED")
}

export async function activateUser(userId: string) {
  return await updateUserStatus(userId, "ACTIVE")
}

export async function suspendPost(postId: string) {
  return await updatePostStatus(postId, "SUSPENDED")
}

export async function activatePost(postId: string) {
  return await updatePostStatus(postId, "ACTIVE")
}

export async function deletePostAdmin(postId: string) {
  return await deletePost(postId)
}

export async function deleteCommunityAdmin(communityId: string) {
  return await prisma.community.delete({
    where: { id: communityId }
  })
}