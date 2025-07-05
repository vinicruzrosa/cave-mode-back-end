import { AlarmService } from '../../src/services/alarm.service';
import { AlarmRepository } from '../../src/repositories/alarm.repository';
import { CreateAlarmRequest, UpdateAlarmRequest, AlarmRepeat } from '../../src/types/alarm';

// Mock do AlarmRepository
jest.mock('../../src/repositories/alarm.repository');

// Mock do fs/promises
jest.mock('fs/promises', () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  writeFile: jest.fn(),
}));

// Mock do path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
}));

// Mock do sharp
jest.mock('sharp', () => {
  return jest.fn().mockImplementation(() => ({
    metadata: jest.fn().mockResolvedValue({
      width: 100,
      height: 100,
      channels: 3,
      hasAlpha: false,
      hasProfile: false,
      isOpaque: true,
      format: 'jpeg',
      space: 'srgb',
      depth: 'uchar',
      density: 72,
      chromaSubsampling: '4:2:0',
      isProgressive: false,
      orientation: 1,
      icc: null,
      exif: null,
      xmp: null,
      tifftagPhotoshop: null,
    }),
    resize: jest.fn().mockReturnThis(),
    raw: jest.fn().mockReturnThis(),
    stats: jest.fn().mockResolvedValue({
      channels: [
        { min: 0, max: 255, sum: 12750, squaresSum: 1625625, mean: 127.5, stdev: 73.6, median: 127 },
        { min: 0, max: 255, sum: 12750, squaresSum: 1625625, mean: 127.5, stdev: 73.6, median: 127 },
        { min: 0, max: 255, sum: 12750, squaresSum: 1625625, mean: 127.5, stdev: 73.6, median: 127 }
      ],
      isOpaque: true,
      dominant: { r: 127, g: 127, b: 127 }
    }),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('fake-image-data')),
  }));
});

describe('AlarmService', () => {
  let service: AlarmService;
  let mockRepository: jest.Mocked<AlarmRepository>;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findActiveByUserId: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createSelfie: jest.fn(),
      getSelfiesByAlarmId: jest.fn(),
    } as jest.Mocked<AlarmRepository>;
    
    service = new AlarmService();
    (service as any).repository = mockRepository;
    jest.clearAllMocks();
  });

  describe('createAlarm', () => {
    it('should create alarm successfully with future time', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1); // 1 hora no futuro

      const createAlarmData: CreateAlarmRequest = {
        time: futureTime.toISOString(),
        repeat: 'daily',
      };

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockResolvedValue(mockAlarm);

      const result = await service.createAlarm(1, createAlarmData);

      expect(mockRepository.create).toHaveBeenCalledWith(1, futureTime, 'daily');
      expect(result).toEqual({
        ...mockAlarm,
        time: mockAlarm.time.toISOString(),
        createdAt: mockAlarm.createdAt.toISOString(),
        updatedAt: mockAlarm.updatedAt.toISOString(),
      });
    });

    it('should throw error when alarm time is in the past', async () => {
      const pastTime = new Date();
      pastTime.setHours(pastTime.getHours() - 1); // 1 hora no passado

      const createAlarmData: CreateAlarmRequest = {
        time: pastTime.toISOString(),
        repeat: 'daily',
      };

      await expect(service.createAlarm(1, createAlarmData)).rejects.toThrow(
        'Alarm time must be in the future'
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('getAlarms', () => {
    it('should return all alarms for user', async () => {
      const mockAlarms = [
        {
          id: 1,
          userId: 1,
          time: new Date('2024-01-16T07:00:00.000Z'),
          active: true,
          repeat: 'daily',
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
        {
          id: 2,
          userId: 1,
          time: new Date('2024-01-16T08:00:00.000Z'),
          active: false,
          repeat: 'once',
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
      ];

      mockRepository.findByUserId.mockResolvedValue(mockAlarms);

      const result = await service.getAlarms(1);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        userId: 1,
        time: mockAlarms[0].time.toISOString(),
        active: true,
        repeat: 'daily',
        createdAt: mockAlarms[0].createdAt.toISOString(),
        updatedAt: mockAlarms[0].updatedAt.toISOString(),
      });
    });
  });

  describe('getActiveAlarms', () => {
    it('should return only active alarms for user', async () => {
      const mockAlarms = [
        {
          id: 1,
          userId: 1,
          time: new Date('2024-01-16T07:00:00.000Z'),
          active: true,
          repeat: 'daily',
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
      ];

      mockRepository.findActiveByUserId.mockResolvedValue(mockAlarms);

      const result = await service.getActiveAlarms(1);

      expect(mockRepository.findActiveByUserId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(1);
      expect(result[0].active).toBe(true);
    });
  });

  describe('updateAlarm', () => {
    it('should update alarm successfully', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

      const updatedAlarm = {
        ...mockAlarm,
        time: futureTime,
        repeat: 'weekly',
        active: false,
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);
      mockRepository.update.mockResolvedValue(updatedAlarm);

      const updateData: UpdateAlarmRequest = {
        time: futureTime.toISOString(),
        repeat: 'weekly',
        active: false,
      };

      const result = await service.updateAlarm(1, 1, updateData);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        time: futureTime,
        repeat: 'weekly',
        active: false,
      });
      expect(result).toEqual({
        ...updatedAlarm,
        time: updatedAlarm.time.toISOString(),
        createdAt: updatedAlarm.createdAt.toISOString(),
        updatedAt: updatedAlarm.updatedAt.toISOString(),
        selfies: [],
        user: {
          id: 1,
          email: 'test@example.com',
        },
      });
    });

    it('should throw error when alarm not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const updateData: UpdateAlarmRequest = {
        time: new Date().toISOString(),
      };

      await expect(service.updateAlarm(1, 999, updateData)).rejects.toThrow(
        'Alarm not found or access denied'
      );
    });

    it('should throw error when alarm belongs to different user', async () => {
      const mockAlarm = {
        id: 1,
        userId: 2, // Diferente do usuário que está tentando atualizar
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 2, email: 'other@example.com' },
        selfies: [],
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);

      const updateData: UpdateAlarmRequest = {
        time: new Date().toISOString(),
      };

      await expect(service.updateAlarm(1, 1, updateData)).rejects.toThrow(
        'Alarm not found or access denied'
      );
    });

    it('should throw error when updating to past time', async () => {
      const pastTime = new Date();
      pastTime.setHours(pastTime.getHours() - 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);

      const updateData: UpdateAlarmRequest = {
        time: pastTime.toISOString(),
      };

      await expect(service.updateAlarm(1, 1, updateData)).rejects.toThrow(
        'Alarm time must be in the future'
      );
    });
  });

  describe('deleteAlarm', () => {
    it('should delete alarm successfully', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);
      mockRepository.delete.mockResolvedValue(mockAlarm);

      await service.deleteAlarm(1, 1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error when alarm not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.deleteAlarm(1, 999)).rejects.toThrow(
        'Alarm not found or access denied'
      );
    });
  });

  describe('processSelfie', () => {
    it('should process selfie and approve with good lighting', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

      const mockSelfie = {
        id: 1,
        alarmId: 1,
        imagePath: '/uploads/selfies/selfie_1_1234567890.jpg',
        brightness: 150,
        approved: true,
        createdAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);
      mockRepository.createSelfie.mockResolvedValue(mockSelfie);

      const imageBuffer = Buffer.from('fake-image-data');

      const result = await service.processSelfie(1, 1, imageBuffer);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.createSelfie).toHaveBeenCalledWith(
        1,
        expect.stringContaining('selfie_1_'),
        150,
        true
      );
      expect(mockRepository.update).toHaveBeenCalledWith(1, { active: false });
      expect(result).toEqual(mockSelfie);
    });

    it('should reject selfie with poor lighting', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

      const mockSelfie = {
        id: 1,
        alarmId: 1,
        imagePath: '/uploads/selfies/selfie_1_1234567890.jpg',
        brightness: 50,
        approved: false,
        createdAt: new Date(),
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);
      mockRepository.createSelfie.mockResolvedValue(mockSelfie);

      const imageBuffer = Buffer.from('fake-dark-image-data');

      const result = await service.processSelfie(1, 1, imageBuffer);

      expect(mockRepository.createSelfie).toHaveBeenCalledWith(
        1,
        expect.stringContaining('selfie_1_'),
        50,
        false
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(result.approved).toBe(false);
    });

    it('should throw error when alarm not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const imageBuffer = Buffer.from('fake-image-data');

      await expect(service.processSelfie(1, 999, imageBuffer)).rejects.toThrow(
        'Alarm not found or access denied'
      );
    });

    it('should throw error when alarm is not active', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: false, // Alarme inativo
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

      mockRepository.findById.mockResolvedValue(mockAlarm);

      const imageBuffer = Buffer.from('fake-image-data');

      await expect(service.processSelfie(1, 1, imageBuffer)).rejects.toThrow(
        'Alarm is not active'
      );
    });
  });

  describe('getSelfiesByAlarm', () => {
    it('should return selfies for alarm', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: new Date('2024-01-16T07:00:00.000Z'),
        active: true,
        repeat: 'daily',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, email: 'test@example.com' },
        selfies: [],
      };

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
          brightness: 80,
          approved: false,
          createdAt: new Date(),
        },
      ];

      mockRepository.findById.mockResolvedValue(mockAlarm);
      mockRepository.getSelfiesByAlarmId.mockResolvedValue(mockSelfies);

      const result = await service.getSelfiesByAlarm(1, 1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.getSelfiesByAlarmId).toHaveBeenCalledWith(1);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 1,
        alarmId: 1,
        imagePath: '/path/to/selfie1.jpg',
        brightness: 150,
        approved: true,
        createdAt: mockSelfies[0].createdAt.toISOString(),
      });
    });
  });
}); 