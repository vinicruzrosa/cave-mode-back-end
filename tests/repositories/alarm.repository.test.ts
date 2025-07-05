import { AlarmRepository } from '../../src/repositories/alarm.repository';
import { prisma } from '../utils/test-utils';
import { AlarmRepeat } from '../../src/types/alarm';

// Mock do Prisma
jest.mock('../../src/repositories/alarm.repository', () => {
  const originalModule = jest.requireActual('../../src/repositories/alarm.repository');
  return {
    ...originalModule,
    prisma: require('../utils/test-utils').prisma,
  };
});

describe('AlarmRepository', () => {
  let repository: AlarmRepository;

  beforeEach(() => {
    repository = new AlarmRepository();
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an alarm successfully', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily' as AlarmRepeat,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.create.mockResolvedValue(mockAlarm);

      const result = await repository.create(1, new Date('2024-01-16T07:00:00.000Z'), 'daily');

      expect(prisma.alarm.create).toHaveBeenCalledWith({
        data: {
          userId: 1,
          time: new Date('2024-01-16T07:00:00.000Z'),
          repeat: 'daily',
          active: true,
        },
      });
      expect(result).toEqual(mockAlarm);
    });
  });

  describe('findById', () => {
    it('should find alarm by id with user and selfies', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily' as AlarmRepeat,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          email: 'test@example.com',
        },
        selfies: [],
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);

      const result = await repository.findById(1);

      expect(prisma.alarm.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
          selfies: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });
      expect(result).toEqual(mockAlarm);
    });

    it('should return null when alarm not found', async () => {
      prisma.alarm.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find all alarms for a user', async () => {
      const mockAlarms = [
        {
          id: 1,
          userId: 1,
          time: new Date('2024-01-16T07:00:00.000Z'),
          active: true,
          repeat: 'daily' as AlarmRepeat,
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
      ];

      prisma.alarm.findMany.mockResolvedValue(mockAlarms);

      const result = await repository.findByUserId(1);

      expect(prisma.alarm.findMany).toHaveBeenCalledWith({
        where: { userId: 1 },
        orderBy: { time: 'asc' },
        include: {
          selfies: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });
      expect(result).toEqual(mockAlarms);
    });
  });

  describe('findActiveByUserId', () => {
    it('should find only active alarms for a user', async () => {
      const mockAlarms = [
        {
          id: 1,
          userId: 1,
          time: new Date('2024-01-16T07:00:00.000Z'),
          active: true,
          repeat: 'daily' as AlarmRepeat,
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
      ];

      prisma.alarm.findMany.mockResolvedValue(mockAlarms);

      const result = await repository.findActiveByUserId(1);

      expect(prisma.alarm.findMany).toHaveBeenCalledWith({
        where: {
          userId: 1,
          active: true,
        },
        orderBy: { time: 'asc' },
        include: {
          selfies: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });
      expect(result).toEqual(mockAlarms);
    });
  });

  describe('update', () => {
    it('should update alarm successfully', async () => {
      const updateData = {
        time: new Date('2024-01-16T07:30:00.000Z'),
        repeat: 'weekly' as AlarmRepeat,
        active: false,
      };

      const mockUpdatedAlarm = {
        id: 1,
        userId: 1,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.update.mockResolvedValue(mockUpdatedAlarm);

      const result = await repository.update(1, updateData);

      expect(prisma.alarm.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedAlarm);
    });
  });

  describe('delete', () => {
    it('should delete alarm successfully', async () => {
      const mockDeletedAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily' as AlarmRepeat,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.delete.mockResolvedValue(mockDeletedAlarm);

      const result = await repository.delete(1);

      expect(prisma.alarm.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockDeletedAlarm);
    });
  });

  describe('createSelfie', () => {
    it('should create selfie successfully', async () => {
      const mockSelfie = {
        id: 1,
        alarmId: 1,
        imagePath: '/path/to/selfie.jpg',
        brightness: 150,
        approved: true,
        createdAt: new Date(),
      };

      prisma.selfie.create.mockResolvedValue(mockSelfie);

      const result = await repository.createSelfie(1, '/path/to/selfie.jpg', 150, true);

      expect(prisma.selfie.create).toHaveBeenCalledWith({
        data: {
          alarmId: 1,
          imagePath: '/path/to/selfie.jpg',
          brightness: 150,
          approved: true,
        },
      });
      expect(result).toEqual(mockSelfie);
    });
  });

  describe('getSelfiesByAlarmId', () => {
    it('should get all selfies for an alarm', async () => {
      const mockSelfies = [
        {
          id: 1,
          alarmId: 1,
          imagePath: '/path/to/selfie1.jpg',
          brightness: 150,
          approved: true,
          createdAt: new Date(),
        },
        {
          id: 2,
          alarmId: 1,
          imagePath: '/path/to/selfie2.jpg',
          brightness: 200,
          approved: false,
          createdAt: new Date(),
        },
      ];

      prisma.selfie.findMany.mockResolvedValue(mockSelfies);

      const result = await repository.getSelfiesByAlarmId(1);

      expect(prisma.selfie.findMany).toHaveBeenCalledWith({
        where: { alarmId: 1 },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockSelfies);
    });
  });
}); 