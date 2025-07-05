import { PrismaClient } from '../../generated/prisma';
import { BlockedApp, CreateBlockedAppRequest, BlockStatusResponse } from '../types/blockedApp';

// Use mock Prisma in test environment
export const prisma = process.env.NODE_ENV === 'test'
  ? require('../../tests/utils/test-utils').prisma 
  : new PrismaClient();

export class BlockedAppRepository {

  async create(userId: number, data: CreateBlockedAppRequest): Promise<BlockedApp> {
    return prisma.blockedApp.create({
      data: {
        userId,
        appName: data.appName,
        type: data.type,
        duration: data.duration,
      },
    });
  }

  async findById(id: number, userId: number): Promise<BlockedApp | null> {
    return prisma.blockedApp.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async findByUserId(userId: number): Promise<BlockedApp[]> {
    return prisma.blockedApp.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: number, userId: number): Promise<boolean> {
    try {
      await prisma.blockedApp.delete({
        where: {
          id,
          userId,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkBlockStatus(userId: number, appName: string): Promise<BlockStatusResponse> {
    const blockedApp = await prisma.blockedApp.findFirst({
      where: {
        userId,
        appName: {
          equals: appName,
          mode: 'insensitive',
        },
      },
    });

    if (!blockedApp) {
      return {
        isBlocked: false,
        appName,
      };
    }

    // Check if temporary block has expired
    if (blockedApp.type === 'temporary' && blockedApp.duration) {
      const createdAt = blockedApp.createdAt;
      const expiresAt = new Date(createdAt.getTime() + blockedApp.duration * 60 * 1000);
      
      if (new Date() > expiresAt) {
        // Block has expired, delete it
        await this.delete(blockedApp.id, userId);
        return {
          isBlocked: false,
          appName,
        };
      }

      return {
        isBlocked: true,
        appName,
        type: blockedApp.type,
        expiresAt: expiresAt.toISOString(),
      };
    }

    return {
      isBlocked: true,
      appName,
      type: blockedApp.type,
    };
  }

  async exists(id: number, userId: number): Promise<boolean> {
    const blockedApp = await prisma.blockedApp.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });
    return !!blockedApp;
  }

  async cleanupExpiredBlocks(): Promise<number> {
    const now = new Date();
    const expiredBlocks = await prisma.blockedApp.findMany({
      where: {
        type: 'temporary',
        duration: {
          not: null,
        },
        createdAt: {
          lt: new Date(now.getTime() - 24 * 60 * 60 * 1000), // Older than 24 hours
        },
      },
    });

    let deletedCount = 0;
    for (const block of expiredBlocks) {
      const expiresAt = new Date(block.createdAt.getTime() + (block.duration || 0) * 60 * 1000);
      if (now > expiresAt) {
        await prisma.blockedApp.delete({
          where: {
            id: block.id,
          },
        });
        deletedCount++;
      }
    }

    return deletedCount;
  }
} 