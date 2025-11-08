'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function getFollowedCommunities() {
  const session = await auth()

  if (!session?.user) {
    return []
  }

  const follows = await prisma.follow.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      community: true,
    },
  })

  return follows.map((follow) => follow.community)
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
      icon,
    },
  });
}

export async function followCommunity(userId: string, communityId: string) {
  const existingFollow = await prisma.follow.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId,
      },
    },
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: {
        userId_communityId: {
          userId,
          communityId,
        },
      },
    });
    return { followed: false };
  } else {
    await prisma.follow.create({
      data: {
        userId,
        communityId,
      },
    });
    return { followed: true };
  }
}

export async function getCommunityBySlug(slug: string) {
  return await prisma.community.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          follows: true,
          posts: true,
        },
      },
    },
  });
}

export async function isUserFollowingCommunity(
  userId: string,
  communityId: string
) {
  const follow = await prisma.follow.findUnique({
    where: {
      userId_communityId: {
        userId,
        communityId,
      },
    },
  });
  return !!follow;
}

export async function getAllCommunities() {
  return await prisma.community.findMany({
    include: {
      _count: {
        select: {
          follows: true,
        },
      },
    },
  });
}
