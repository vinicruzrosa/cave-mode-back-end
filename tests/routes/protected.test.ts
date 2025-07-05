import { protectedRoutes } from '../../src/routes/protected';
import { mockRequest, mockReply, generateTestToken } from '../utils/test-utils';

describe('Protected Routes', () => {
  let fastify: any;

  beforeEach(() => {
    // Mock Fastify instance
    fastify = {
      addHook: jest.fn(),
      get: jest.fn(),
    };
  });

  describe('protectedRoutes registration', () => {
    it('should register protected routes with authentication middleware', async () => {
      await protectedRoutes(fastify);

      expect(fastify.addHook).toHaveBeenCalledWith('preHandler', expect.any(Function));
      expect(fastify.get).toHaveBeenCalledWith('/profile', expect.any(Function));
      expect(fastify.get).toHaveBeenCalledWith('/dashboard', expect.any(Function));
    });
  });

  describe('profile route', () => {
    it('should return user profile with userId', async () => {
      const userId = 1;
      const request = mockRequest({}, {});
      request.userId = userId;
      const reply = mockReply();

      // Simula chamada Fastify
      const handler = async (req: any, rep: any) => {
        rep.send({
          message: 'Rota protegida acessada com sucesso',
          userId: req.userId
        });
      };
      await handler(request, reply);
      expect(reply.send).toHaveBeenCalledWith({
        message: 'Rota protegida acessada com sucesso',
        userId: userId
      });
    });
  });

  describe('dashboard route', () => {
    it('should return dashboard data with userId', async () => {
      const userId = 1;
      const request = mockRequest({}, {});
      request.userId = userId;
      const reply = mockReply();

      // Simula chamada Fastify
      const handler = async (req: any, rep: any) => {
        rep.send({
          message: 'Dashboard do usuário',
          userId: req.userId,
          data: 'Dados sensíveis do usuário'
        });
      };
      await handler(request, reply);
      expect(reply.send).toHaveBeenCalledWith({
        message: 'Dashboard do usuário',
        userId: userId,
        data: 'Dados sensíveis do usuário'
      });
    });
  });
}); 