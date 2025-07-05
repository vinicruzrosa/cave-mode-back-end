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
exports.prisma = exports.teardownTestDatabase = exports.setupTestDatabase = void 0;
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
exports.prisma = prisma;
const setupTestDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    // Limpa todas as tabelas antes dos testes
    yield prisma.blockedApp.deleteMany();
    yield prisma.goal.deleteMany();
    yield prisma.alarm.deleteMany();
    yield prisma.routine.deleteMany();
    yield prisma.user.deleteMany();
});
exports.setupTestDatabase = setupTestDatabase;
const teardownTestDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
});
exports.teardownTestDatabase = teardownTestDatabase;
