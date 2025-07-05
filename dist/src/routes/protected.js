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
exports.protectedRoutes = void 0;
const auth_1 = require("../middleware/auth");
const protectedRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    // Aplicar middleware de autenticação a todas as rotas
    fastify.addHook('preHandler', auth_1.authenticate);
    // Rota protegida de exemplo
    fastify.get('/profile', {
        schema: {
            tags: ['Protected'],
            summary: 'Obter perfil do usuário',
            description: 'Retorna informações do perfil do usuário autenticado. Requer token JWT válido.',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Perfil obtido com sucesso',
                    $ref: '#/components/schemas/ProfileResponse'
                },
                401: {
                    description: 'Token de autenticação inválido ou expirado',
                    $ref: '#/components/schemas/ErrorResponse'
                },
                500: {
                    description: 'Erro interno do servidor',
                    $ref: '#/components/schemas/ErrorResponse'
                }
            }
        }
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const userId = request.userId;
        return {
            message: 'Perfil do usuário obtido com sucesso',
            userId: userId,
            user: {
                id: userId,
                email: ((_a = request.user) === null || _a === void 0 ? void 0 : _a.email) || 'usuario@exemplo.com',
                createdAt: new Date().toISOString()
            }
        };
    }));
    // Outra rota protegida
    fastify.get('/dashboard', {
        schema: {
            tags: ['Protected'],
            summary: 'Obter dashboard do usuário',
            description: 'Retorna dados do dashboard do usuário autenticado. Requer token JWT válido.',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Dashboard obtido com sucesso',
                    $ref: '#/components/schemas/DashboardResponse'
                },
                401: {
                    description: 'Token de autenticação inválido ou expirado',
                    $ref: '#/components/schemas/ErrorResponse'
                },
                500: {
                    description: 'Erro interno do servidor',
                    $ref: '#/components/schemas/ErrorResponse'
                }
            }
        }
    }, (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = request.userId;
        return {
            message: 'Dashboard carregado com sucesso',
            userId: userId,
            data: {
                totalItems: 42,
                lastLogin: new Date().toISOString(),
                preferences: {
                    theme: 'dark',
                    notifications: true
                }
            }
        };
    }));
});
exports.protectedRoutes = protectedRoutes;
