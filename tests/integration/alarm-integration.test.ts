import { FastifyInstance } from 'fastify';
import { build } from '../../src/server';
import { prisma } from '../utils/test-utils';

describe('Alarm Integration Tests', () => {
  let server: FastifyInstance;
  let authToken: string;

  beforeAll(async () => {
    server = await build();
  });

  beforeEach(async () => {
    // Limpar dados de teste
    await prisma.alarm.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuário e obter token
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedpassword',
      createdAt: new Date(),
    };

    prisma.user.create.mockResolvedValue(mockUser);
    prisma.user.findUnique.mockResolvedValue(mockUser);

    // Fazer login para obter token
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: 'test@example.com',
        password: '123456',
      },
    });

    const loginData = JSON.parse(loginResponse.payload);
    authToken = loginData.token;
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /alarms', () => {
    it('should create alarm successfully', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.create.mockResolvedValue(mockAlarm);

      const response = await server.inject({
        method: 'POST',
        url: '/api/alarms',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          time: futureTime.toISOString(),
          repeat: 'daily',
        },
      });

      expect(response.statusCode).toBe(201);
      const data = JSON.parse(response.payload);
      expect(data.message).toBe('Alarme criado com sucesso');
      expect(data.alarm).toBeDefined();
    });

    it('should reject alarm with past time', async () => {
      const pastTime = new Date();
      pastTime.setHours(pastTime.getHours() - 1);

      const response = await server.inject({
        method: 'POST',
        url: '/api/alarms',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          time: pastTime.toISOString(),
          repeat: 'daily',
        },
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toContain('future');
    });

    it('should reject invalid repeat value', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const response = await server.inject({
        method: 'POST',
        url: '/api/alarms',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          time: futureTime.toISOString(),
          repeat: 'invalid-repeat',
        },
      });

      expect(response.statusCode).toBe(400);
    });

    it('should reject request without authentication', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const response = await server.inject({
        method: 'POST',
        url: '/api/alarms',
        payload: {
          time: futureTime.toISOString(),
          repeat: 'daily',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /alarms', () => {
    it('should return all alarms for user', async () => {
      const futureTime1 = new Date();
      futureTime1.setHours(futureTime1.getHours() + 1);

      const futureTime2 = new Date();
      futureTime2.setHours(futureTime2.getHours() + 2);

      prisma.alarm.findMany.mockResolvedValue([
        {
          id: 1,
          userId: 1,
          time: futureTime1,
          repeat: 'daily',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
        {
          id: 2,
          userId: 1,
          time: futureTime2,
          repeat: 'weekly',
          active: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
      ]);

      const response = await server.inject({
        method: 'GET',
        url: '/api/alarms',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.alarms).toHaveLength(2);
    });

    it('should return empty array when no alarms exist', async () => {
      prisma.alarm.findMany.mockResolvedValue([]);

      const response = await server.inject({
        method: 'GET',
        url: '/api/alarms',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.alarms).toHaveLength(0);
    });
  });

  describe('GET /alarms/active', () => {
    it('should return only active alarms', async () => {
      const futureTime1 = new Date();
      futureTime1.setHours(futureTime1.getHours() + 1);

      prisma.alarm.findMany.mockResolvedValue([
        {
          id: 1,
          userId: 1,
          time: futureTime1,
          repeat: 'daily',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          selfies: [],
        },
      ]);

      const response = await server.inject({
        method: 'GET',
        url: '/api/alarms/active',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.alarms).toHaveLength(1);
      expect(data.alarms[0].active).toBe(true);
    });
  });

  describe('GET /alarms/:id', () => {
    it('should return specific alarm', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
          id: 1,
          email: 'test@example.com',
        },
        selfies: [],
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);

      const response = await server.inject({
        method: 'GET',
        url: '/api/alarms/1',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.alarm).toBeDefined();
      expect(data.alarm.id).toBe(1);
    });

    it('should return 404 for non-existent alarm', async () => {
      prisma.alarm.findUnique.mockResolvedValue(null);

      const response = await server.inject({
        method: 'GET',
        url: '/alarms/999',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PUT /alarms/:id', () => {
    it('should update alarm successfully', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);
      prisma.alarm.update.mockResolvedValue({
        ...mockAlarm,
        repeat: 'weekly',
        active: false,
      });

      const response = await server.inject({
        method: 'PUT',
        url: '/api/alarms/1',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          repeat: 'weekly',
          active: false,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.message).toBe('Alarme atualizado com sucesso');
    });

    it('should reject update with past time', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);

      const pastTime = new Date();
      pastTime.setHours(pastTime.getHours() - 1);

      const response = await server.inject({
        method: 'PUT',
        url: '/api/alarms/1',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          time: pastTime.toISOString(),
        },
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toContain('future');
    });
  });

  describe('DELETE /alarms/:id', () => {
    it('should delete alarm successfully', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);
      prisma.alarm.delete.mockResolvedValue(mockAlarm);

      const response = await server.inject({
        method: 'DELETE',
        url: '/api/alarms/1',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.message).toBe('Alarme deletado com sucesso');
    });
  });

  describe('POST /alarms/:id/selfie', () => {
    it('should upload selfie successfully', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSelfie = {
        id: 1,
        alarmId: 1,
        imagePath: '/uploads/selfie.jpg',
        brightness: 150,
        approved: true,
        createdAt: new Date(),
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);
      prisma.selfie.create.mockResolvedValue(mockSelfie);

      const response = await server.inject({
        method: 'POST',
        url: '/api/alarms/1/selfie',
        headers: {
          authorization: `Bearer ${authToken}`,
          'content-type': 'multipart/form-data',
        },
        payload: {
          file: Buffer.from('fake-image-data'),
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.message).toContain('Selfie aprovada');
    });

    it('should reject selfie upload for inactive alarm', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: false, // Inactive alarm
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);

      const response = await server.inject({
        method: 'POST',
        url: '/api/alarms/1/selfie',
        headers: {
          authorization: `Bearer ${authToken}`,
          'content-type': 'multipart/form-data',
        },
        payload: {
          file: Buffer.from('fake-image-data'),
        },
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toContain('não está ativo');
    });
  });

  describe('GET /alarms/:id/selfies', () => {
    it('should return selfies for alarm', async () => {
      const futureTime = new Date();
      futureTime.setHours(futureTime.getHours() + 1);

      const mockAlarm = {
        id: 1,
        userId: 1,
        time: futureTime,
        repeat: 'daily',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockSelfies = [
        {
          id: 1,
          alarmId: 1,
          imagePath: '/uploads/selfie1.jpg',
          brightness: 150,
          approved: true,
          createdAt: new Date(),
        },
        {
          id: 2,
          alarmId: 1,
          imagePath: '/uploads/selfie2.jpg',
          brightness: 80,
          approved: false,
          createdAt: new Date(),
        },
      ];

      prisma.alarm.findUnique.mockResolvedValue(mockAlarm);
      prisma.selfie.findMany.mockResolvedValue(mockSelfies);

      const response = await server.inject({
        method: 'GET',
        url: '/api/alarms/1/selfies',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.selfies).toHaveLength(2);
    });
  });
}); 