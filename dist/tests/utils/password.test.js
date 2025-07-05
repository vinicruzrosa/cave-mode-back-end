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
const password_1 = require("../../src/utils/password");
describe('Password Utils', () => {
    describe('hashPassword', () => {
        it('should hash a password', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'testpassword123';
            const hashedPassword = yield (0, password_1.hashPassword)(password);
            expect(hashedPassword).toBeDefined();
            expect(hashedPassword).not.toBe(password);
            expect(hashedPassword).toMatch(/^\$2[aby]\$\d{1,2}\$[./A-Za-z0-9]{53}$/);
        }));
        it('should generate different hashes for the same password', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'testpassword123';
            const hash1 = yield (0, password_1.hashPassword)(password);
            const hash2 = yield (0, password_1.hashPassword)(password);
            expect(hash1).not.toBe(hash2);
        }));
    });
    describe('comparePassword', () => {
        it('should return true for correct password', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'testpassword123';
            const hashedPassword = yield (0, password_1.hashPassword)(password);
            const result = yield (0, password_1.comparePassword)(password, hashedPassword);
            expect(result).toBe(true);
        }));
        it('should return false for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'testpassword123';
            const wrongPassword = 'wrongpassword';
            const hashedPassword = yield (0, password_1.hashPassword)(password);
            const result = yield (0, password_1.comparePassword)(wrongPassword, hashedPassword);
            expect(result).toBe(false);
        }));
        it('should return false for empty password', () => __awaiter(void 0, void 0, void 0, function* () {
            const password = 'testpassword123';
            const hashedPassword = yield (0, password_1.hashPassword)(password);
            const result = yield (0, password_1.comparePassword)('', hashedPassword);
            expect(result).toBe(false);
        }));
    });
});
