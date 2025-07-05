import { PrismaClient } from '@prisma/client';
import { AlarmRepeat } from '../types/alarm';

// Use mock Prisma in test environment
export const prisma = process.env.NODE_ENV === 'test'
  ? require('../../tests/utils/test-utils').prisma 
  : new PrismaClient();

export class AlarmRepository {
  async create(userId: number, time: Date, repeat: AlarmRepeat) {
    return await prisma.alarm.create({
      data: {
        userId,
        time,
        repeat,
        active: true
      }
    });
  }

  async findById(id: number) {
    return await prisma.alarm.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        selfies: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
  }

  async findByUserId(userId: number) {
    return await prisma.alarm.findMany({
      where: { userId },
      orderBy: { time: 'asc' },
      include: {
        selfies: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
  }

  async findActiveByUserId(userId: number) {
    return await prisma.alarm.findMany({
      where: { 
        userId,
        active: true 
      },
      orderBy: { time: 'asc' },
      include: {
        selfies: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
  }

  async update(id: number, data: { time?: Date; repeat?: AlarmRepeat; active?: boolean }) {
    return await prisma.alarm.update({
      where: { id },
      data
    });
  }

  async delete(id: number) {
    return await prisma.alarm.delete({
      where: { id }
    });
  }

  async createSelfie(alarmId: number, imagePath: string, brightness: number, approved: boolean) {
    return await prisma.selfie.create({
      data: {
        alarmId,
        imagePath,
        brightness,
        approved
      }
    });
  }

  async getSelfiesByAlarmId(alarmId: number) {
    return await prisma.selfie.findMany({
      where: { alarmId },
      orderBy: { createdAt: 'desc' }
    });
  }
} 