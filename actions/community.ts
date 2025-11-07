"use server"

import { prisma } from "@/lib/db"

export async function createCommunity(name: string, slug: string, description: string, creatorId: string, icon?: string) {
  return await prisma.community.create({
    data: {
      name,
      slug,
      description,
      creatorId,
      icon,
    }
  })
}

export async function getAllCommunities() {
  return await prisma.community.findMany({
    include: {
      _count: {
        select: {
          follows: true,
          posts: true
        }
      }
    },
    orderBy: { name: "asc" }
  })
}

export async function getCommunityBySlug(slug: string) {
  return await prisma.community.findUnique({
    where: { slug },
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
    }
  })
}

export async function followCommunity(userId: string, communityId: string) {
  const existing = await prisma.follow.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId
      }
    }
  })

  if (existing) {
    return await prisma.follow.delete({
      where: {
        userId_communityId: {
          userId,
          communityId
        }
      }
    })
  }

  return await prisma.follow.create({
    data: {
      userId,
      communityId
    }
  })
}

export async function getUserFollowedCommunities(userId: string) {
  return await prisma.follow.findMany({
    where: { userId },
    include: {
      community: {
        include: {
          _count: {
            select: {
              follows: true,
              posts: true
            }
          }
        }
      }
    }
  })
}

export async function isUserFollowingCommunity(userId: string, communityId: string) {
  const follow = await prisma.follow.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId
      }
    }
  })
  return !!follow
}

export async function getUserFollowedCommunitiesSimple(userId: string) {
  const follows = await prisma.follow.findMany({
    where: { userId },
    include: {
      community: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  })
  return follows.map((f: any) => f.community)
}