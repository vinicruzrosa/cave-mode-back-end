import { PrismaClient } from '../../generated/prisma';
import { Goal, CreateGoalRequest, UpdateGoalRequest } from '../types/goal';

// Use mock Prisma in test environment
export const prisma = process.env.NODE_ENV === 'test'
  ? require('../../tests/utils/test-utils').prisma 
  : new PrismaClient();

export class GoalRepository {

  async create(userId: number, data: CreateGoalRequest): Promise<Goal> {
    return prisma.goal.create({
      data: {
        userId,
        title: data.title,
      },
    });
  }

  async findById(id: number, userId: number): Promise<Goal | null> {
    return prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async findByUserId(userId: number): Promise<Goal[]> {
    return prisma.goal.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, userId: number, data: UpdateGoalRequest): Promise<Goal | null> {
    const updateData: any = {};
    
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.completed !== undefined) {
      updateData.completed = data.completed;
    }

    return prisma.goal.update({
      where: {
        id,
        userId,
      },
      data: updateData,
    });
  }

  async markAsCompleted(id: number, userId: number): Promise<Goal | null> {
    return prisma.goal.update({
      where: {
        id,
        userId,
      },
      data: {
        completed: true,
      },
    });
  }

  async delete(id: number, userId: number): Promise<boolean> {
    try {
      await prisma.goal.delete({
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

  async exists(id: number, userId: number): Promise<boolean> {
    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });
    return !!goal;
  }

  async getCompletedCount(userId: number): Promise<number> {
    return prisma.goal.count({
      where: {
        userId,
        completed: true,
      },
    });
  }

  async getTotalCount(userId: number): Promise<number> {
    return prisma.goal.count({
      where: {
        userId,
      },
    });
  }
} 