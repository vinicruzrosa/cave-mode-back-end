"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockReply = exports.mockRequest = exports.cleanupDatabase = exports.generateTestToken = exports.createTestUser = exports.prisma = void 0;
const jwt_1 = require("../../src/utils/jwt");
// Mock do Prisma para testes
const mockPrisma = {
    user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        deleteMany: jest.fn(),
    },
    blockedApp: {
        deleteMany: jest.fn(),
    },
    goal: {
        deleteMany: jest.fn(),
    },
    alarm: {
        deleteMany: jest.fn(),
    },
    routine: {
        deleteMany: jest.fn(),
    },
    $disconnect: jest.fn(),
};
exports.prisma = mockPrisma;
const createTestUser = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (email = 'test@example.com', password = '123456') {
    const bcrypt = require('bcryptjs');
    const hashedPassword = yield bcrypt.hash(password, 10);
    const mockUser = {
        id: 1,
        email,
        createdAt: new Date(),
    };
    exports.prisma.user.create.mockResolvedValue(mockUser);
    return mockUser;
});
exports.createTestUser = createTestUser;
const generateTestToken = (userId, email) => {
    return (0, jwt_1.generateToken)({ userId, email });
};
exports.generateTestToken = generateTestToken;
const cleanupDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // Limpa todos os mocks
    jest.clearAllMocks();
    // Reseta os mocks para valores padrão
    exports.prisma.blockedApp.deleteMany.mockResolvedValue({ count: 0 });
    exports.prisma.goal.deleteMany.mockResolvedValue({ count: 0 });
    exports.prisma.alarm.deleteMany.mockResolvedValue({ count: 0 });
    exports.prisma.routine.deleteMany.mockResolvedValue({ count: 0 });
    exports.prisma.user.deleteMany.mockResolvedValue({ count: 0 });
});
exports.cleanupDatabase = cleanupDatabase;
const mockRequest = (body = {}, headers = {}) => {
    return {
        body,
        headers,
    };
};
exports.mockRequest = mockRequest;
const mockReply = () => {
    const reply = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
    };
    return reply;
};
exports.mockReply = mockReply;
