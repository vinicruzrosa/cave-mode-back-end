import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '../../generated/prisma';
import { registerSchema, loginSchema } from '../schemas/auth';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

// Use mock Prisma in test environment
const prisma = process.env.NODE_ENV === 'test' 
  ? require('../../tests/utils/test-utils').prisma 
  : new PrismaClient();

export const register = async (
  request: FastifyRequest<{ Body: RegisterRequest }>,
  reply: FastifyReply
) => {
  try {
    // Validar dados de entrada
    const validatedData = registerSchema.parse(request.body);
    
    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (existingUser) {
      return reply.status(400).send({
        error: 'Usuário já existe com este email'
      });
    }
    
    // Criptografar senha
    const hashedPassword = await hashPassword(validatedData.password);
    
    // Criar usuário
    const user = await prisma.user.create({
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
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
    
    return reply.status(201).send(response);
    
  } catch (error) {
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
        } catch (parseError) {
          // Se não conseguir parsear, retorna 400
          return reply.status(400).send({ error: error.message });
        }
      }
      // Outros erros (ex: banco) retornam 500
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
    return reply.status(500).send({ error: 'Erro interno do servidor' });
  }
};

export const login = async (
  request: FastifyRequest<{ Body: LoginRequest }>,
  reply: FastifyReply
) => {
  try {
    // Validar dados de entrada
    const validatedData = loginSchema.parse(request.body);
    
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });
    
    if (!user) {
      return reply.status(401).send({
        error: 'Email ou senha inválidos'
      });
    }
    
    // Verificar senha
    const isPasswordValid = await comparePassword(
      validatedData.password,
      user.password
    );
    
    if (!isPasswordValid) {
      return reply.status(401).send({
        error: 'Email ou senha inválidos'
      });
    }
    
    // Gerar token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });
    
    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
    
    return reply.status(200).send(response);
    
  } catch (error) {
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
        } catch (parseError) {
          // Se não conseguir parsear, retorna 400
          return reply.status(400).send({ error: error.message });
        }
      }
      // Outros erros (ex: banco) retornam 500
      return reply.status(500).send({ error: 'Erro interno do servidor' });
    }
    return reply.status(500).send({ error: 'Erro interno do servidor' });
  }
};

export const authRoutes = async (fastify: FastifyInstance) => {
  // Rota de registro
  fastify.post('/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Registrar novo usuário',
      description: 'Cria uma nova conta de usuário com email e senha. A senha será criptografada antes de ser armazenada no banco de dados.',
      body: {
        $ref: 'RegisterRequest'
      },
      response: {
        201: {
          description: 'Usuário registrado com sucesso',
          $ref: 'AuthResponse'
        },
        400: {
          description: 'Dados inválidos ou usuário já existe',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, register);

  // Rota de login
  fastify.post('/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Fazer login',
      description: 'Autentica usuário com email e senha. Retorna um token JWT válido por 24 horas.',
      body: {
        $ref: 'LoginRequest'
      },
      response: {
        200: {
          description: 'Login realizado com sucesso',
          $ref: 'AuthResponse'
        },
        400: {
          description: 'Dados inválidos',
          $ref: 'ErrorResponse'
        },
        401: {
          description: 'Credenciais inválidas',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, login);
}; 