import { FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../../src/middleware/auth';
import { verifyToken } from '../../src/utils/jwt';

// Mock do verifyToken
jest.mock('../../src/utils/jwt', () => ({
  verifyToken: jest.fn(),
}));

describe('Auth Middleware', () => {
  let mockRequest: Partial<FastifyRequest>;
  let mockReply: Partial<FastifyReply>;
  let mockVerifyToken: jest.MockedFunction<typeof verifyToken>;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
    mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>;
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('should authenticate with valid token', async () => {
      mockRequest.headers = {
        authorization: 'Bearer valid-token-here',
      };
      mockVerifyToken.mockReturnValue({ userId: 1, email: 'test@example.com' });

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token-here');
      expect((mockRequest as any).userId).toBe(1);
    });

    it('should reject request without authorization header', async () => {
      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Token de autenticação não fornecido',
      });
    });

    it('should reject request with invalid authorization format', async () => {
      mockRequest.headers = {
        authorization: 'InvalidFormat token',
      };

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Token inválido',
      });
    });

    it('should reject request with invalid token', async () => {
      mockRequest.headers = {
        authorization: 'Bearer invalid-token',
      };
      mockVerifyToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Token inválido',
      });
    });

    it('should handle case-insensitive authorization header', async () => {
      mockRequest.headers = {
        authorization: 'bearer valid-token-here',
      };
      mockVerifyToken.mockReturnValue({ userId: 1, email: 'test@example.com' });

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token-here');
      expect((mockRequest as any).userId).toBe(1);
    });

    it('should handle authorization header with extra spaces', async () => {
      mockRequest.headers = {
        authorization: 'Bearer   valid-token-here  ',
      };
      mockVerifyToken.mockReturnValue({ userId: 1, email: 'test@example.com' });

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockVerifyToken).toHaveBeenCalledWith('valid-token-here');
      expect((mockRequest as any).userId).toBe(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined headers', async () => {
      mockRequest.headers = undefined;

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Token de autenticação não fornecido',
      });
    });

    it('should handle authorization header with only Bearer', async () => {
      mockRequest.headers = {
        authorization: 'Bearer ',
      };

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockReply.status).toHaveBeenCalledWith(401);
      expect(mockReply.send).toHaveBeenCalledWith({
        error: 'Token inválido',
      });
    });

    it('should handle authorization header with multiple spaces', async () => {
      mockRequest.headers = {
        authorization: 'Bearer   token-with-spaces  ',
      };
      mockVerifyToken.mockReturnValue({ userId: 1, email: 'test@example.com' });

      await authenticate(mockRequest as FastifyRequest, mockReply as FastifyReply);

      expect(mockVerifyToken).toHaveBeenCalledWith('token-with-spaces');
      expect((mockRequest as any).userId).toBe(1);
    });
  });
}); 