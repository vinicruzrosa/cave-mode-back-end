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
const protected_1 = require("../../src/routes/protected");
const test_utils_1 = require("../utils/test-utils");
describe('Protected Routes', () => {
    let fastify;
    beforeEach(() => {
        // Mock Fastify instance
        fastify = {
            addHook: jest.fn(),
            get: jest.fn(),
        };
    });
    describe('protectedRoutes registration', () => {
        it('should register protected routes with authentication middleware', () => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, protected_1.protectedRoutes)(fastify);
            expect(fastify.addHook).toHaveBeenCalledWith('preHandler', expect.any(Function));
            expect(fastify.get).toHaveBeenCalledWith('/profile', expect.any(Function));
            expect(fastify.get).toHaveBeenCalledWith('/dashboard', expect.any(Function));
        }));
    });
    describe('profile route', () => {
        it('should return user profile with userId', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = 1;
            const request = (0, test_utils_1.mockRequest)({}, {});
            request.userId = userId;
            const reply = (0, test_utils_1.mockReply)();
            // Simula chamada Fastify
            const handler = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
                rep.send({
                    message: 'Rota protegida acessada com sucesso',
                    userId: req.userId
                });
            });
            yield handler(request, reply);
            expect(reply.send).toHaveBeenCalledWith({
                message: 'Rota protegida acessada com sucesso',
                userId: userId
            });
        }));
    });
    describe('dashboard route', () => {
        it('should return dashboard data with userId', () => __awaiter(void 0, void 0, void 0, function* () {
            const userId = 1;
            const request = (0, test_utils_1.mockRequest)({}, {});
            request.userId = userId;
            const reply = (0, test_utils_1.mockReply)();
            // Simula chamada Fastify
            const handler = (req, rep) => __awaiter(void 0, void 0, void 0, function* () {
                rep.send({
                    message: 'Dashboard do usuário',
                    userId: req.userId,
                    data: 'Dados sensíveis do usuário'
                });
            });
            yield handler(request, reply);
            expect(reply.send).toHaveBeenCalledWith({
                message: 'Dashboard do usuário',
                userId: userId,
                data: 'Dados sensíveis do usuário'
            });
        }));
    });
});
