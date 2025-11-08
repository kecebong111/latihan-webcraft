"use server"

import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function getAllCommunities() {
  return await prisma.community.findMany({
    include: {
      _count: {
        select: { follows: true }
      }
    }
  })
}

export async function getCommunityBySlug(slug: string) {
  return await prisma.community.findUnique({
    where: { slug },
    include: {
      _count: {
        select: { follows: true, posts: true }
      }
    }
  })
}

export async function followCommunity(userId: string, communityId: string) {
  // Check if user is already following the community
  const existingFollow = await prisma.follow.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId
      }
    }
  })

  if (existingFollow) {
    // User is already following, return the existing follow
    return existingFollow
  }

  // Create new follow if not already following
  return await prisma.follow.create({
    data: {
      userId,
      communityId
    }
  })
}

export async function unfollowCommunity(userId: string, communityId: string) {
  return await prisma.follow.deleteMany({
    where: {
      userId,
      communityId
    }
  })
}

export async function getFollowedCommunities() {
  const session = await auth()
  
  if (!session?.user?.id) {
    return []
  }
  
  try {
    const follows = await prisma.follow.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        community: true,
      },
    })

    return follows.map((follow) => follow.community)
  } catch (error) {
    return []
  }
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

export async function createCommunity(
  name: string,
  slug: string,
  description: string,
  creatorId: string,
  icon?: string
) {
  return await prisma.community.create({
    data: {
      name,
      slug,
      description,
      creatorId,
      icon
    }
  })
}