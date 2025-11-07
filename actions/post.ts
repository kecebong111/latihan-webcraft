"use server"

import { prisma } from "@/lib/db"

export async function createPost(title: string, content: string, authorId: string, communityId: string, isBoardPost = false, image?: string) {
  return await prisma.post.create({
    data: {
      title,
      content,
      image,
      authorId,
      communityId,
      isBoardPost,
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
          icon: true,
        }
      }
    }
  })
}

export async function getFeedPosts(userId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const userCommunities = await prisma.follow.findMany({
    where: { userId },
    select: { communityId: true }
  })

  const communityIds = userCommunities.map((f: any) => f.communityId)

  if (communityIds.length === 0) {
    return { posts: [], total: 0 }
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        communityId: { in: communityIds },
        status: "ACTIVE"
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
            icon: true,
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: [
        { isBoardPost: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: {
        communityId: { in: communityIds },
        status: "ACTIVE"
      }
    })
  ])

  return { posts, total }
}

export async function getCommunityPosts(communityId: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        communityId,
        status: "ACTIVE"
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
            icon: true,
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: [
        { isBoardPost: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: {
        communityId,
        status: "ACTIVE"
      }
    })
  ])

  return { posts, total }
}

export async function updatePostStatus(postId: string, status: "ACTIVE" | "SUSPENDED") {
  return await prisma.post.update({
    where: { id: postId },
    data: { status }
  })
}

export async function deletePost(postId: string) {
  return await prisma.post.delete({
    where: { id: postId }
  })
}

export async function searchPosts(query: string, userId?: string, page = 1, limit = 10) {
  const skip = (page - 1) * limit

  let communityIds: string[] = []

  if (userId) {
    const userCommunities = await prisma.follow.findMany({
      where: { userId },
      select: { communityId: true }
    })
    communityIds = userCommunities.map((f: any) => f.communityId)
  }

  const whereClause: any = {
    status: "ACTIVE",
    OR: [
      { title: { contains: query, mode: "insensitive" as const } },
      { content: { contains: query, mode: "insensitive" as const } }
    ],
    // Only filter by communities if user follows any
    ...(userId && communityIds.length > 0 && { communityId: { in: communityIds } })
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: whereClause,
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
            icon: true,
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: [
        { isBoardPost: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: whereClause
    })
  ])

  return { posts, total }
}

export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id },
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
          icon: true,
        }
      },
      _count: {
        select: {
          comments: true
        }
      }
    }
  })
}