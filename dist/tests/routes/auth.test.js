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
const auth_1 = require("../../src/routes/auth");
const test_utils_1 = require("../utils/test-utils");
describe('Auth Routes', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, test_utils_1.cleanupDatabase)();
        // Reset bcrypt mocks
        jest.restoreAllMocks();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield test_utils_1.prisma.$disconnect();
    }));
    describe('register', () => {
        it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 1,
                email: 'newuser@example.com',
                createdAt: new Date(),
            };
            test_utils_1.prisma.user.create.mockResolvedValue(mockUser);
            test_utils_1.prisma.user.findUnique.mockResolvedValue(null); // Usuário não existe inicialmente
            const request = (0, test_utils_1.mockRequest)({
                email: 'newuser@example.com',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.register)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(201);
            expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
                token: expect.any(String),
                user: {
                    id: expect.any(Number),
                    email: 'newuser@example.com'
                }
            }));
            // Verify user creation was called
            expect(test_utils_1.prisma.user.create).toHaveBeenCalled();
        }));
        it('should reject registration with existing email', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock existing user
            const existingUser = {
                id: 1,
                email: 'existing@example.com',
                password: 'hashedpassword',
            };
            test_utils_1.prisma.user.findUnique.mockResolvedValue(existingUser);
            const request = (0, test_utils_1.mockRequest)({
                email: 'existing@example.com',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.register)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Usuário já existe com este email'
            });
        }));
        it('should reject registration with invalid email', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({
                email: 'invalid-email',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.register)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Email inválido'
            });
        }));
        it('should reject registration with short password', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({
                email: 'test@example.com',
                password: '123'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.register)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Senha deve ter pelo menos 6 caracteres'
            });
        }));
        it('should handle database errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock Prisma para lançar erro
            test_utils_1.prisma.user.create.mockImplementation(() => { throw new Error('Database error'); });
            test_utils_1.prisma.user.findUnique.mockResolvedValue(null);
            const request = (0, test_utils_1.mockRequest)({
                email: 'test@example.com',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.register)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(500);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Erro interno do servidor'
            });
        }));
    });
    describe('login', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user for login tests
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: '$2a$10$hashedpassword', // Mock hashed password
            };
            test_utils_1.prisma.user.findUnique.mockResolvedValue(mockUser);
        }));
        it('should login successfully with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: '$2a$10$hashedpassword',
            };
            test_utils_1.prisma.user.findUnique.mockResolvedValue(mockUser);
            // Mock bcrypt.compare para retornar true
            const bcrypt = require('bcryptjs');
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            const request = (0, test_utils_1.mockRequest)({
                email: 'test@example.com',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.login)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(200);
            expect(reply.send).toHaveBeenCalledWith(expect.objectContaining({
                token: expect.any(String),
                user: {
                    id: expect.any(Number),
                    email: 'test@example.com'
                }
            }));
        }));
        it('should reject login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user with different password
            const mockUser = {
                id: 1,
                email: 'test@example.com',
                password: '$2a$10$differenthash', // Different hash
            };
            test_utils_1.prisma.user.findUnique.mockResolvedValue(mockUser);
            // Mock bcrypt.compare para retornar false (senha incorreta)
            const bcrypt = require('bcryptjs');
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
            const request = (0, test_utils_1.mockRequest)({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.login)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Email ou senha inválidos'
            });
        }));
        it('should reject login with non-existent email', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user not found
            test_utils_1.prisma.user.findUnique.mockResolvedValue(null);
            const request = (0, test_utils_1.mockRequest)({
                email: 'nonexistent@example.com',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.login)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Email ou senha inválidos'
            });
        }));
        it('should reject login with invalid email format', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({
                email: 'invalid-email',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.login)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Email inválido'
            });
        }));
        it('should reject login with empty password', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({
                email: 'test@example.com',
                password: ''
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.login)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(400);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Senha é obrigatória'
            });
        }));
        it('should handle database errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock Prisma para lançar erro
            test_utils_1.prisma.user.findUnique.mockImplementation(() => { throw new Error('Database error'); });
            const request = (0, test_utils_1.mockRequest)({
                email: 'test@example.com',
                password: '123456'
            });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.login)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(500);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Erro interno do servidor'
            });
        }));
    });
});
