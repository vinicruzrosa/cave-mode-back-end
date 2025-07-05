import { register, login } from '../../src/routes/auth';
import { mockRequest, mockReply, createTestUser, cleanupDatabase, prisma } from '../utils/test-utils';

describe('Auth Routes', () => {
  beforeEach(async () => {
    await cleanupDatabase();
    // Reset bcrypt mocks
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        createdAt: new Date(),
      };
      
      prisma.user.create.mockResolvedValue(mockUser);
      prisma.user.findUnique.mockResolvedValue(null); // Usuário não existe inicialmente

      const request = mockRequest({
        email: 'newuser@example.com',
        password: '123456'
      });
      const reply = mockReply();

      await register(request, reply);

      expect(reply.status).toHaveBeenCalledWith(201);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: {
            id: expect.any(Number),
            email: 'newuser@example.com'
          }
        })
      );

      // Verify user creation was called
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should reject registration with existing email', async () => {
      // Mock existing user
      const existingUser = {
        id: 1,
        email: 'existing@example.com',
        password: 'hashedpassword',
      };
      
      prisma.user.findUnique.mockResolvedValue(existingUser);

      const request = mockRequest({
        email: 'existing@example.com',
        password: '123456'
      });
      const reply = mockReply();

      await register(request, reply);

      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Usuário já existe com este email'
      });
    });

    it('should reject registration with invalid email', async () => {
      const request = mockRequest({
        email: 'invalid-email',
        password: '123456'
      });
      const reply = mockReply();

      await register(request, reply);

      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Email inválido'
      });
    });

    it('should reject registration with short password', async () => {
      const request = mockRequest({
        email: 'test@example.com',
        password: '123'
      });
      const reply = mockReply();

      await register(request, reply);

      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Senha deve ter pelo menos 6 caracteres'
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock Prisma para lançar erro
      prisma.user.create.mockImplementation(() => { throw new Error('Database error'); });
      prisma.user.findUnique.mockResolvedValue(null);

      const request = mockRequest({
        email: 'test@example.com',
        password: '123456'
      });
      const reply = mockReply();

      await register(request, reply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Erro interno do servidor'
      });
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // Mock user for login tests
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: '$2a$10$hashedpassword', // Mock hashed password
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
    });

    it('should login successfully with correct credentials', async () => {
      // Mock user
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: '$2a$10$hashedpassword',
      };
      prisma.user.findUnique.mockResolvedValue(mockUser);
      // Mock bcrypt.compare para retornar true
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const request = mockRequest({
        email: 'test@example.com',
        password: '123456'
      });
      const reply = mockReply();

      await login(request, reply);

      expect(reply.status).toHaveBeenCalledWith(200);
      expect(reply.send).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: {
            id: expect.any(Number),
            email: 'test@example.com'
          }
        })
      );
    });

    it('should reject login with incorrect password', async () => {
      // Mock user with different password
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: '$2a$10$differenthash', // Different hash
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
      
      // Mock bcrypt.compare para retornar false (senha incorreta)
      const bcrypt = require('bcryptjs');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      const request = mockRequest({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      const reply = mockReply();

      await login(request, reply);

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Email ou senha inválidos'
      });
    });

    it('should reject login with non-existent email', async () => {
      // Mock user not found
      prisma.user.findUnique.mockResolvedValue(null);

      const request = mockRequest({
        email: 'nonexistent@example.com',
        password: '123456'
      });
      const reply = mockReply();

      await login(request, reply);

      expect(reply.status).toHaveBeenCalledWith(401);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Email ou senha inválidos'
      });
    });

    it('should reject login with invalid email format', async () => {
      const request = mockRequest({
        email: 'invalid-email',
        password: '123456'
      });
      const reply = mockReply();

      await login(request, reply);

      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Email inválido'
      });
    });

    it('should reject login with empty password', async () => {
      const request = mockRequest({
        email: 'test@example.com',
        password: ''
      });
      const reply = mockReply();

      await login(request, reply);

      expect(reply.status).toHaveBeenCalledWith(400);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Senha é obrigatória'
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock Prisma para lançar erro
      prisma.user.findUnique.mockImplementation(() => { throw new Error('Database error'); });

      const request = mockRequest({
        email: 'test@example.com',
        password: '123456'
      });
      const reply = mockReply();

      await login(request, reply);

      expect(reply.status).toHaveBeenCalledWith(500);
      expect(reply.send).toHaveBeenCalledWith({
        error: 'Erro interno do servidor'
      });
    });
  });
}); 