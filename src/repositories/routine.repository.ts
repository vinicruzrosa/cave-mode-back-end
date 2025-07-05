import { PrismaClient } from '../../generated/prisma';
import { Routine, CreateRoutineRequest, UpdateRoutineRequest } from '../types/routine';

// Use mock Prisma in test environment
export const prisma = process.env.NODE_ENV === 'test'
  ? require('../../tests/utils/test-utils').prisma 
  : new PrismaClient();

export class RoutineRepository {

  async create(userId: number, data: CreateRoutineRequest): Promise<Routine> {
    return prisma.routine.create({
      data: {
        userId,
        title: data.title,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
      },
    });
  }

  async findById(id: number, userId: number): Promise<Routine | null> {
    return prisma.routine.findFirst({
      where: {
        id,
        userId,
      },
    });
  }

  async findByUserId(userId: number): Promise<Routine[]> {
    return prisma.routine.findMany({
      where: {
        userId,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async update(id: number, userId: number, data: UpdateRoutineRequest): Promise<Routine | null> {
    const updateData: any = {};
    
    if (data.title !== undefined) {
      updateData.title = data.title;
    }
    if (data.startTime !== undefined) {
      updateData.startTime = new Date(data.startTime);
    }
    if (data.endTime !== undefined) {
      updateData.endTime = new Date(data.endTime);
    }

    return prisma.routine.update({
      where: {
        id,
        userId,
      },
      data: updateData,
    });
  }

  async delete(id: number, userId: number): Promise<boolean> {
    try {
      await prisma.routine.delete({
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
    const routine = await prisma.routine.findFirst({
      where: {
        id,
        userId,
      },
      select: {
        id: true,
      },
    });
    return !!routine;
  }
} 