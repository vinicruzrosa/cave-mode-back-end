"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../src/schemas/auth");
describe('Auth Schemas', () => {
    describe('registerSchema', () => {
        it('should validate correct register data', () => {
            const validData = {
                email: 'test@example.com',
                password: '123456'
            };
            const result = auth_1.registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: '123456'
            };
            const result = auth_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email inválido');
            }
        });
        it('should reject short password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '123'
            };
            const result = auth_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Senha deve ter pelo menos 6 caracteres');
            }
        });
        it('should reject empty password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: ''
            };
            const result = auth_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Senha deve ter pelo menos 6 caracteres');
            }
        });
        it('should reject missing email', () => {
            const invalidData = {
                password: '123456'
            };
            const result = auth_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
        it('should reject missing password', () => {
            const invalidData = {
                email: 'test@example.com'
            };
            const result = auth_1.registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
    describe('loginSchema', () => {
        it('should validate correct login data', () => {
            const validData = {
                email: 'test@example.com',
                password: '123456'
            };
            const result = auth_1.loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: '123456'
            };
            const result = auth_1.loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Email inválido');
            }
        });
        it('should reject empty password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: ''
            };
            const result = auth_1.loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('Senha é obrigatória');
            }
        });
        it('should accept short password (different from register)', () => {
            const validData = {
                email: 'test@example.com',
                password: '123'
            };
            const result = auth_1.loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
        it('should reject missing email', () => {
            const invalidData = {
                password: '123456'
            };
            const result = auth_1.loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
        it('should reject missing password', () => {
            const invalidData = {
                email: 'test@example.com'
            };
            const result = auth_1.loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});
