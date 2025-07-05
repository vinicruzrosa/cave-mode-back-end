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
const auth_1 = require("../../src/middleware/auth");
const jwt_1 = require("../../src/utils/jwt");
const test_utils_1 = require("../utils/test-utils");
describe('Auth Middleware', () => {
    describe('authenticate', () => {
        it('should authenticate valid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const payload = { userId: 1, email: 'test@example.com' };
            const token = (0, jwt_1.generateToken)(payload);
            const request = (0, test_utils_1.mockRequest)({}, { authorization: `Bearer ${token}` });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.authenticate)(request, reply);
            expect(request.userId).toBe(payload.userId);
            expect(reply.status).not.toHaveBeenCalled();
            expect(reply.send).not.toHaveBeenCalled();
        }));
        it('should reject request without authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({}, {});
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.authenticate)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Token de autenticação não fornecido'
            });
        }));
        it('should reject request with invalid authorization format', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({}, { authorization: 'InvalidFormat token' });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.authenticate)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Token de autenticação não fornecido'
            });
        }));
        it('should reject request with invalid token', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({}, { authorization: 'Bearer invalid.token.here' });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.authenticate)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Token inválido'
            });
        }));
        it('should reject request with empty token', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({}, { authorization: 'Bearer ' });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.authenticate)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Token inválido'
            });
        }));
        it('should reject request with malformed token', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = (0, test_utils_1.mockRequest)({}, { authorization: 'Bearer not.a.valid.jwt' });
            const reply = (0, test_utils_1.mockReply)();
            yield (0, auth_1.authenticate)(request, reply);
            expect(reply.status).toHaveBeenCalledWith(401);
            expect(reply.send).toHaveBeenCalledWith({
                error: 'Token inválido'
            });
        }));
    });
});
