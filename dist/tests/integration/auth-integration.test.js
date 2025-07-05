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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const fastify_1 = __importDefault(require("fastify"));
const auth_1 = require("../../src/routes/auth");
const protected_1 = require("../../src/routes/protected");
const test_utils_1 = require("../utils/test-utils");
// Mock do bcrypt para testes de integração
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockResolvedValue('$2a$10$hashedpassword'),
    compare: jest.fn().mockResolvedValue(true),
}));
describe('Auth Integration Tests', () => {
    let app;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        app = (0, fastify_1.default)();
        app.register(auth_1.authRoutes, { prefix: '/api/auth' });
        app.register(protected_1.protectedRoutes, { prefix: '/api/protected' });
        yield app.ready();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, test_utils_1.cleanupDatabase)();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield app.close();
        yield test_utils_1.prisma.$disconnect();
    }));
    describe('POST /api/auth/register', () => {
        it('should register a new user and return token', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user creation
            const mockUser = {
                id: 1,
                email: 'newuser@example.com',
                createdAt: new Date(),
            };
            test_utils_1.prisma.user.create.mockResolvedValue(mockUser);
            test_utils_1.prisma.user.findUnique.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/register')
                .send({
                email: 'newuser@example.com',
                password: '123456'
            })
                .expect(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe('newuser@example.com');
            expect(response.body.user).toHaveProperty('id');
        }));
        it('should reject duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock existing user
            const existingUser = {
                id: 1,
                email: 'duplicate@example.com',
                password: 'hashedpassword',
            };
            test_utils_1.prisma.user.findUnique.mockResolvedValue(existingUser);
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/register')
                .send({
                email: 'duplicate@example.com',
                password: '123456'
            })
                .expect(400);
            expect(response.body.error).toBe('Usuário já existe com este email');
        }));
        it('should reject invalid email format', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/register')
                .send({
                email: 'invalid-email',
                password: '123456'
            })
                .expect(400);
            expect(response.body.error).toBe('Email inválido');
        }));
        it('should reject short password', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/register')
                .send({
                email: 'test@example.com',
                password: '123'
            })
                .expect(400);
            expect(response.body.error).toBe('Senha deve ter pelo menos 6 caracteres');
        }));
    });
    describe('POST /api/auth/login', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user for login
            const mockUser = {
                id: 1,
                email: 'login@example.com',
                password: '$2a$10$hashedpassword',
            };
            test_utils_1.prisma.user.findUnique.mockResolvedValue(mockUser);
        }));
        it('should login successfully with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: '123456'
            })
                .expect(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body).toHaveProperty('user');
            expect(response.body.user.email).toBe('login@example.com');
        }));
        it('should reject incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock bcrypt to return false for comparison
            const bcrypt = require('bcryptjs');
            bcrypt.compare.mockResolvedValue(false);
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/login')
                .send({
                email: 'login@example.com',
                password: 'wrongpassword'
            })
                .expect(401);
            expect(response.body.error).toBe('Email ou senha inválidos');
        }));
        it('should reject non-existent email', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user not found
            test_utils_1.prisma.user.findUnique.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: '123456'
            })
                .expect(401);
            expect(response.body.error).toBe('Email ou senha inválidos');
        }));
    });
    describe('Protected Routes', () => {
        let authToken;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            // Mock user and generate token
            const mockUser = {
                id: 1,
                email: 'protected@example.com',
                createdAt: new Date(),
            };
            test_utils_1.prisma.user.create.mockResolvedValue(mockUser);
            test_utils_1.prisma.user.findUnique.mockResolvedValue(null);
            // Register to get token
            const registerResponse = yield (0, supertest_1.default)(app.server)
                .post('/api/auth/register')
                .send({
                email: 'protected@example.com',
                password: '123456'
            });
            authToken = registerResponse.body.token;
        }));
        it('should access protected profile route with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .get('/api/protected/profile')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('userId');
            expect(response.body.message).toBe('Rota protegida acessada com sucesso');
        }));
        it('should access protected dashboard route with valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .get('/api/protected/dashboard')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('userId');
            expect(response.body).toHaveProperty('data');
            expect(response.body.message).toBe('Dashboard do usuário');
        }));
        it('should reject access without token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .get('/api/protected/profile')
                .expect(401);
            expect(response.body.error).toBe('Token de autenticação não fornecido');
        }));
        it('should reject access with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .get('/api/protected/profile')
                .set('Authorization', 'Bearer invalid.token.here')
                .expect(401);
            expect(response.body.error).toBe('Token inválido');
        }));
        it('should reject access with malformed authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app.server)
                .get('/api/protected/profile')
                .set('Authorization', 'InvalidFormat token')
                .expect(401);
            expect(response.body.error).toBe('Token de autenticação não fornecido');
        }));
    });
});
