import { FastifyRequest, FastifyReply } from 'fastify';
import { AlarmController } from '../../src/controllers/alarm.controller';
import { AlarmService } from '../../src/services/alarm.service';
import { AlarmRepeat } from '../../src/types/alarm';

// Mock do AlarmService
jest.mock('../../src/services/alarm.service');

describe('AlarmController', () => {
  let controller: AlarmController;
  let mockService: jest.Mocked<AlarmService>;

  beforeEach(() => {
    mockService = {
      createAlarm: jest.fn(),
      getAlarms: jest.fn(),
      getActiveAlarms: jest.fn(),
      updateAlarm: jest.fn(),
      deleteAlarm: jest.fn(),
      processSelfie: jest.fn(),
      getSelfiesByAlarm: jest.fn(),
    } as any;

    controller = new AlarmController();
    (controller as any).service = mockService;
  });

  describe('createAlarm', () => {
    it('should create alarm successfully', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: '2024-01-16T07:00:00.000Z',
        active: true,
        repeat: 'daily' as AlarmRepeat,
        createdAt: '2024-01-16T07:00:00.000Z',
        updatedAt: '2024-01-16T07:00:00.000Z',
      };

      const mockRequest = {
        body: {
          time: '2024-01-16T07:00:00.000Z',
          repeat: 'daily',
        },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.createAlarm.mockResolvedValue(mockAlarm);

      await controller.createAlarm(mockRequest, mockReply);

      expect(mockService.createAlarm).toHaveBeenCalledWith(1, {
        time: '2024-01-16T07:00:00.000Z',
        repeat: 'daily',
      });
      expect(mockReply.status).toHaveBeenCalledWith(201);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Alarme criado com sucesso',
        alarm: mockAlarm,
      });
    });

    it('should handle validation errors', async () => {
      const mockRequest = {
        body: {
          time: 'invalid-date',
          repeat: 'invalid-repeat',
        },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.createAlarm.mockRejectedValue(new Error('Time must be in the future'));

      await controller.createAlarm(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Time must be in the future',
      });
    });
  });

  describe('getAlarms', () => {
    it('should get all alarms for user', async () => {
      const mockAlarms = [
        {
          id: 1,
          userId: 1,
          time: '2024-01-16T07:00:00.000Z',
          active: true,
          repeat: 'daily' as AlarmRepeat,
          createdAt: '2024-01-16T07:00:00.000Z',
          updatedAt: '2024-01-16T07:00:00.000Z',
        },
      ];

      const mockRequest = {
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.getAlarms.mockResolvedValue(mockAlarms);

      await controller.getAlarms(mockRequest, mockReply);

      expect(mockService.getAlarms).toHaveBeenCalledWith(1);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        alarms: mockAlarms,
      });
    });
  });

  describe('getActiveAlarms', () => {
    it('should get only active alarms for user', async () => {
      const mockAlarms = [
        {
          id: 1,
          userId: 1,
          time: '2024-01-16T07:00:00.000Z',
          active: true,
          repeat: 'daily' as AlarmRepeat,
          createdAt: '2024-01-16T07:00:00.000Z',
          updatedAt: '2024-01-16T07:00:00.000Z',
        },
      ];

      const mockRequest = {
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.getActiveAlarms.mockResolvedValue(mockAlarms);

      await controller.getActiveAlarms(mockRequest, mockReply);

      expect(mockService.getActiveAlarms).toHaveBeenCalledWith(1);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        alarms: mockAlarms,
      });
    });
  });

  describe('updateAlarm', () => {
    it('should update alarm successfully', async () => {
      const mockAlarm = {
        id: 1,
        userId: 1,
        time: '2024-01-16T07:30:00.000Z',
        active: false,
        repeat: 'weekly' as AlarmRepeat,
        createdAt: '2024-01-16T07:00:00.000Z',
        updatedAt: '2024-01-16T07:00:00.000Z',
      };

      const mockRequest = {
        params: { id: '1' },
        body: {
          time: '2024-01-16T07:30:00.000Z',
          repeat: 'weekly',
          active: false,
        },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.updateAlarm.mockResolvedValue(mockAlarm);

      await controller.updateAlarm(mockRequest, mockReply);

      expect(mockService.updateAlarm).toHaveBeenCalledWith(1, 1, {
        time: '2024-01-16T07:30:00.000Z',
        repeat: 'weekly',
        active: false,
      });
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Alarme atualizado com sucesso',
        alarm: mockAlarm,
      });
    });

    it('should handle not found error', async () => {
      const mockRequest = {
        params: { id: '999' },
        body: {
          time: '2024-01-16T07:30:00.000Z',
        },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.updateAlarm.mockRejectedValue(new Error('Alarm not found'));

      await controller.updateAlarm(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Alarm not found',
      });
    });
  });

  describe('deleteAlarm', () => {
    it('should delete alarm successfully', async () => {
      const mockRequest = {
        params: { id: '1' },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.deleteAlarm.mockResolvedValue(undefined);

      await controller.deleteAlarm(mockRequest, mockReply);

      expect(mockService.deleteAlarm).toHaveBeenCalledWith(1, 1);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        message: 'Alarme deletado com sucesso',
      });
    });

    it('should return 404 when alarm not found', async () => {
      const mockRequest = {
        params: { id: '999' },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.deleteAlarm.mockRejectedValue(new Error('Alarm not found'));

      await controller.deleteAlarm(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(404);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Alarm not found',
      });
    });
  });

  describe('uploadSelfie', () => {
    it('should upload selfie successfully', async () => {
      const mockFile = {
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('test-image')),
      };

      const mockRequest = {
        params: { id: '1' },
        userId: 1,
        file: jest.fn().mockResolvedValue(mockFile),
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.processSelfie.mockResolvedValue({
        id: 1,
        alarmId: 1,
        imagePath: '/uploads/test.jpg',
        brightness: 150,
        approved: true,
        createdAt: '2024-01-16T07:00:00.000Z',
      });

      await controller.uploadSelfie(mockRequest, mockReply);

      expect(mockService.processSelfie).toHaveBeenCalledWith(1, 1, Buffer.from('test-image'));
      expect(mockReply.status).toHaveBeenCalledWith(200);
    });

    it('should handle missing file', async () => {
      const mockRequest = {
        params: { id: '1' },
        userId: 1,
        file: jest.fn().mockResolvedValue(undefined),
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      await controller.uploadSelfie(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(400);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Nenhuma imagem foi enviada',
      });
    });

    it('should handle service errors', async () => {
      const mockFile = {
        filename: 'test.jpg',
        mimetype: 'image/jpeg',
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('test-image')),
      };

      const mockRequest = {
        params: { id: '1' },
        userId: 1,
        file: jest.fn().mockResolvedValue(mockFile),
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.processSelfie.mockRejectedValue(new Error('Service error'));

      await controller.uploadSelfie(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(500);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Erro interno do servidor',
      });
    });
  });

  describe('getSelfiesByAlarm', () => {
    it('should get selfies for alarm', async () => {
      const mockSelfies = [
        {
          id: 1,
          alarmId: 1,
          imagePath: '/uploads/selfie1.jpg',
          brightness: 150,
          approved: true,
          createdAt: '2024-01-16T07:00:00.000Z',
        },
      ];

      const mockRequest = {
        params: { id: '1' },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.getSelfiesByAlarm.mockResolvedValue(mockSelfies);

      await controller.getSelfiesByAlarm(mockRequest, mockReply);

      expect(mockService.getSelfiesByAlarm).toHaveBeenCalledWith(1, 1);
      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        selfies: mockSelfies,
      });
    });

    it('should return empty array when no selfies found', async () => {
      const mockRequest = {
        params: { id: '1' },
        userId: 1,
      } as any;

      const mockReply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as any;

      mockService.getSelfiesByAlarm.mockResolvedValue([]);

      await controller.getSelfiesByAlarm(mockRequest, mockReply);

      expect(mockReply.status).toHaveBeenCalledWith(200);
      expect(mockReply.send).toHaveBeenCalledWith({
        selfies: [],
      });
    });
  });
}); 