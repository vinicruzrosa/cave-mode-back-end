import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types/auth';

export const authenticate = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader) {
      return reply.status(401).send({
        error: 'Token de autenticação não fornecido'
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({
        error: 'Token inválido'
      });
    }

    const token = authHeader.substring(7).trim(); // Remove 'Bearer ' prefix and trim spaces
    const payload = verifyToken(token);
    
    // Adiciona userId ao request para uso posterior
    (request as any).userId = payload.userId;
    
  } catch (error) {
    return reply.status(401).send({
      error: 'Token inválido'
    });
  }
}; 