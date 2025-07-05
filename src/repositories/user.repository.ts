import { PrismaClient } from '../../generated/prisma';
import { User, UpdateSafeModeRequest } from '../types/user';

// Use mock Prisma in test environment
export const prisma = process.env.NODE_ENV === 'test'
  ? require('../../tests/utils/test-utils').prisma 
  : new PrismaClient();

export class UserRepository {

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async updateSafeMode(id: number, safeMode: boolean): Promise<User | null> {
    return prisma.user.update({
      where: {
        id,
      },
      data: {
        safeMode,
      },
    });
  }

  async getSafeModeStatus(id: number): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        safeMode: true,
      },
    });
    return user?.safeMode || false;
  }
} 