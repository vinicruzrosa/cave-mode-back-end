import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authenticate } from '../middleware/auth';

export const protectedRoutes = async (fastify: FastifyInstance) => {
  // Aplicar middleware de autenticação a todas as rotas
  fastify.addHook('preHandler', authenticate);
  
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
          $ref: 'ProfileResponse'
        },
        401: {
          description: 'Token de autenticação inválido ou expirado',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request as any).userId;
    
    return {
      message: 'Perfil do usuário obtido com sucesso',
      userId: userId,
      user: {
        id: userId,
        email: (request as any).user?.email || 'usuario@exemplo.com',
        createdAt: new Date().toISOString()
      }
    };
  });
  
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
          $ref: 'DashboardResponse'
        },
        401: {
          description: 'Token de autenticação inválido ou expirado',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = (request as any).userId;
    
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
  });
}; 