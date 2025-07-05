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
const jwt_1 = require("../../src/utils/jwt");
describe('JWT Utils', () => {
    const mockPayload = {
        userId: 1,
        email: 'test@example.com'
    };
    describe('generateToken', () => {
        it('should generate a valid JWT token', () => {
            const token = (0, jwt_1.generateToken)(mockPayload);
            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
        });
        it('should generate different tokens for different payloads', () => {
            const payload1 = { userId: 1, email: 'test1@example.com' };
            const payload2 = { userId: 2, email: 'test2@example.com' };
            const token1 = (0, jwt_1.generateToken)(payload1);
            const token2 = (0, jwt_1.generateToken)(payload2);
            expect(token1).not.toBe(token2);
        });
        it('should generate different tokens for same payload (due to timestamp)', () => __awaiter(void 0, void 0, void 0, function* () {
            const token1 = (0, jwt_1.generateToken)(mockPayload);
            yield new Promise(resolve => setTimeout(resolve, 1100)); // Espera 1.1s para garantir iat diferente
            const token2 = (0, jwt_1.generateToken)(mockPayload);
            expect(token1).not.toBe(token2);
        }), 3000);
    });
    describe('verifyToken', () => {
        it('should verify a valid token', () => {
            const token = (0, jwt_1.generateToken)(mockPayload);
            const decoded = (0, jwt_1.verifyToken)(token);
            expect(decoded).toBeDefined();
            expect(decoded.userId).toBe(mockPayload.userId);
            expect(decoded.email).toBe(mockPayload.email);
        });
        it('should throw error for invalid token', () => {
            const invalidToken = 'invalid.token.here';
            expect(() => {
                (0, jwt_1.verifyToken)(invalidToken);
            }).toThrow('Token inválido');
        });
        it('should throw error for empty token', () => {
            expect(() => {
                (0, jwt_1.verifyToken)('');
            }).toThrow('Token inválido');
        });
        it('should throw error for malformed token', () => {
            const malformedToken = 'not.a.valid.jwt.token';
            expect(() => {
                (0, jwt_1.verifyToken)(malformedToken);
            }).toThrow('Token inválido');
        });
    });
});
