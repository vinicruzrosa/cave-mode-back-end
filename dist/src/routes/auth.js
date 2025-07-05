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
exports.authRoutes = exports.login = exports.register = void 0;
const prisma_1 = require("../../generated/prisma");
const auth_1 = require("../schemas/auth");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
// Use mock Prisma in test environment
const prisma = process.env.NODE_ENV === 'test'
    ? require('../../tests/utils/test-utils').prisma
    : new prisma_1.PrismaClient();
const register = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validar dados de entrada
        const validatedData = auth_1.registerSchema.parse(request.body);
        // Verificar se usuário já existe
        const existingUser = yield prisma.user.findUnique({
            where: { email: validatedData.email }
        });
        if (existingUser) {
            return reply.status(400).send({
                error: 'Usuário já existe com este email'
            });
        }
        // Criptografar senha
        const hashedPassword = yield (0, password_1.hashPassword)(validatedData.password);
        // Criar usuário
        const user = yield prisma.user.create({
            data: {
                email: validatedData.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
            }
        });
        // Gerar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        const response = {
            token,
            user: {
                id: user.id,
                email: user.email,
            }
        };
        return reply.status(201).send(response);
    }
    catch (error) {
        if (error instanceof Error) {
            // Se for erro de validação do Zod
            if (error.name === 'ZodError' || error.message.includes('validation') || error.message.includes('Zod')) {
                try {
                    const zodErrors = JSON.parse(error.message);
                    if (Array.isArray(zodErrors) && zodErrors.length > 0 && zodErrors[0].message) {
                        return reply.status(400).send({
                            error: zodErrors[0].message
                        });
                    }
                }
                catch (parseError) {
                    // Se não conseguir parsear, retorna 400
                    return reply.status(400).send({ error: error.message });
                }
            }
            // Outros erros (ex: banco) retornam 500
            return reply.status(500).send({ error: 'Erro interno do servidor' });
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
});
exports.register = register;
const login = (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validar dados de entrada
        const validatedData = auth_1.loginSchema.parse(request.body);
        // Buscar usuário
        const user = yield prisma.user.findUnique({
            where: { email: validatedData.email }
        });
        if (!user) {
            return reply.status(401).send({
                error: 'Email ou senha inválidos'
            });
        }
        // Verificar senha
        const isPasswordValid = yield (0, password_1.comparePassword)(validatedData.password, user.password);
        if (!isPasswordValid) {
            return reply.status(401).send({
                error: 'Email ou senha inválidos'
            });
        }
        // Gerar token
        const token = (0, jwt_1.generateToken)({
            userId: user.id,
            email: user.email,
        });
        const response = {
            token,
            user: {
                id: user.id,
                email: user.email,
            }
        };
        return reply.status(200).send(response);
    }
    catch (error) {
        if (error instanceof Error) {
            // Se for erro de validação do Zod
            if (error.name === 'ZodError' || error.message.includes('validation') || error.message.includes('Zod')) {
                try {
                    const zodErrors = JSON.parse(error.message);
                    if (Array.isArray(zodErrors) && zodErrors.length > 0 && zodErrors[0].message) {
                        return reply.status(400).send({
                            error: zodErrors[0].message
                        });
                    }
                }
                catch (parseError) {
                    // Se não conseguir parsear, retorna 400
                    return reply.status(400).send({ error: error.message });
                }
            }
            // Outros erros (ex: banco) retornam 500
            return reply.status(500).send({ error: 'Erro interno do servidor' });
        }
        return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
});
exports.login = login;
const authRoutes = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    // Rota de registro
    fastify.post('/register', {
        schema: {
            tags: ['Auth'],
            summary: 'Registrar novo usuário',
            description: 'Cria uma nova conta de usuário com email e senha. A senha será criptografada antes de ser armazenada no banco de dados.',
            body: {
                $ref: '#/components/schemas/RegisterRequest'
            },
            response: {
                201: {
                    description: 'Usuário registrado com sucesso',
                    $ref: '#/components/schemas/AuthResponse'
                },
                400: {
                    description: 'Dados inválidos ou usuário já existe',
                    $ref: '#/components/schemas/ErrorResponse'
                },
                500: {
                    description: 'Erro interno do servidor',
                    $ref: '#/components/schemas/ErrorResponse'
                }
            }
        }
    }, exports.register);
    // Rota de login
    fastify.post('/login', {
        schema: {
            tags: ['Auth'],
            summary: 'Fazer login',
            description: 'Autentica usuário com email e senha. Retorna um token JWT válido por 24 horas.',
            body: {
                $ref: '#/components/schemas/LoginRequest'
            },
            response: {
                200: {
                    description: 'Login realizado com sucesso',
                    $ref: '#/components/schemas/AuthResponse'
                },
                400: {
                    description: 'Dados inválidos',
                    $ref: '#/components/schemas/ErrorResponse'
                },
                401: {
                    description: 'Credenciais inválidas',
                    $ref: '#/components/schemas/ErrorResponse'
                },
                500: {
                    description: 'Erro interno do servidor',
                    $ref: '#/components/schemas/ErrorResponse'
                }
            }
        }
    }, exports.login);
});
exports.authRoutes = authRoutes;
