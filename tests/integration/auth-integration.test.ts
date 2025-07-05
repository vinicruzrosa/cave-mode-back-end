import { FastifyInstance } from 'fastify';
import { build } from '../../src/server';
import { prisma } from '../utils/test-utils';

describe('Auth Integration Tests', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = await build();
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    // Limpar dados de teste
    await prisma.user.deleteMany();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user and return token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      prisma.user.create.mockResolvedValue(mockUser);
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'test@example.com',
          password: '123456',
        },
      });

      expect(response.statusCode).toBe(201);
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject duplicate email', async () => {
      const existingUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(existingUser);

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'test@example.com',
          password: '123456',
        },
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toContain('Usuário já existe com este email');
    });

    it('should reject invalid email format', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'invalid-email',
          password: '123456',
        },
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toContain('Bad Request');
    });

    it('should reject short password', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'test@example.com',
          password: '123',
        },
      });

      expect(response.statusCode).toBe(400);
      const data = JSON.parse(response.payload);
      expect(data.error).toContain('Bad Request');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'test@example.com',
          password: '123456',
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data).toHaveProperty('token');
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe('test@example.com');
    });

    it('should reject incorrect password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'test@example.com',
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
      const data = JSON.parse(response.payload);
      expect(data.error).toBe('Email ou senha inválidos');
    });

    it('should reject non-existent email', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const response = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'nonexistent@example.com',
          password: '123456',
        },
      });

      expect(response.statusCode).toBe(401);
      const data = JSON.parse(response.payload);
      expect(data.error).toBe('Email ou senha inválidos');
    });
  });

  describe('Protected Routes', () => {
    it('should access protected route with valid token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Primeiro fazer login para obter token
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'test@example.com',
          password: '123456',
        },
      });

      const loginData = JSON.parse(loginResponse.payload);
      const token = loginData.token;

      // Acessar rota protegida
      const response = await server.inject({
        method: 'GET',
        url: '/api/protected/dashboard',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.message).toBe('Dashboard acessado com sucesso');
    });

    it('should access profile route with valid token', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(mockUser);

      // Primeiro fazer login para obter token
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'test@example.com',
          password: '123456',
        },
      });

      const loginData = JSON.parse(loginResponse.payload);
      const token = loginData.token;

      // Acessar rota de perfil
      const response = await server.inject({
        method: 'GET',
        url: '/api/protected/profile',
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.message).toBe('Perfil acessado com sucesso');
    });
  });
}); 