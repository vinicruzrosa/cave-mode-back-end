import { PrismaClient } from '../../generated/prisma';
import { generateToken } from '../../src/utils/jwt';

// Mock do Prisma para testes
export const prisma = {
  alarm: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  selfie: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
  $disconnect: jest.fn(),
};

// Funções helper para testes
export const createMockRequest = (overrides: any = {}) => ({
  headers: {},
  params: {},
  body: {},
  query: {},
  ...overrides,
});

export const createMockReply = () => ({
  status: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
  code: jest.fn().mockReturnThis(),
});

// Limpar todos os mocks
export const clearAllMocks = () => {
  jest.clearAllMocks();
  Object.values(prisma).forEach(model => {
    if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach(method => {
        if (typeof method === 'function' && 'mockClear' in method) {
          method.mockClear();
        }
      });
    }
  });
};

export const createTestUser = async (email: string = 'test@example.com', password: string = '123456') => {
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const mockUser = {
    id: 1,
    email,
    createdAt: new Date(),
  };
  
  prisma.user.create.mockResolvedValue(mockUser);
  
  return mockUser;
};

export const generateTestToken = (userId: number, email: string) => {
  return generateToken({ userId, email });
};

export const cleanupDatabase = async () => {
  // Limpa todos os mocks
  jest.clearAllMocks();
  
  // Reseta os mocks para valores padrão
  prisma.alarm.deleteMany.mockResolvedValue({ count: 0 });
  prisma.selfie.deleteMany.mockResolvedValue({ count: 0 });
  prisma.user.deleteMany.mockResolvedValue({ count: 0 });
};

export const mockRequest = (body: any = {}, headers: any = {}) => {
  return {
    body,
    headers,
  } as any;
};

export const mockReply = () => {
  const reply = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return reply as any;
}; 