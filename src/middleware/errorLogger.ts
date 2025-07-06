import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify';
import { Logger } from '../utils/logger';

const errorLogger = new Logger('ErrorMiddleware');

export const errorLoggingMiddleware = (fastify: FastifyInstance) => {
  // Hook para logar todas as requisições
  fastify.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    (request as any).startTime = Date.now();
  });

  // Hook para logar todas as respostas
  fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) => {
    const duration = Date.now() - (request as any).startTime;
    const status = reply.statusCode;
    
    if (status >= 400) {
      await errorLogger.error(
        `${request.method} ${request.url}`,
        `Request failed with status ${status}`,
        null,
        {
          method: request.method,
          path: request.url,
          statusCode: status,
          duration,
          userId: (request as any).user?.id,
          userAgent: request.headers['user-agent'],
          ip: request.ip,
          body: request.body,
          query: request.query,
          params: request.params
        }
      );
    } else {
      await errorLogger.info(
        `${request.method} ${request.url}`,
        `Request completed successfully`,
        {
          method: request.method,
          path: request.url,
          statusCode: status,
          duration,
          userId: (request as any).user?.id,
          userAgent: request.headers['user-agent'],
          ip: request.ip
        }
      );
    }
  });

  // Hook para capturar erros não tratados
  fastify.setErrorHandler(async (error: Error, request: FastifyRequest, reply: FastifyReply) => {
    const duration = Date.now() - (request as any).startTime || 0;
    
    await errorLogger.fatal(
      `${request.method} ${request.url}`,
      'Unhandled error occurred',
      error,
      {
        method: request.method,
        path: request.url,
        duration,
        userId: (request as any).user?.id,
        userAgent: request.headers['user-agent'],
        ip: request.ip,
        body: request.body,
        query: request.query,
        params: request.params
      }
    );

    // Se a resposta já foi enviada, não envie novamente
    if (reply.sent) {
      return;
    }

    reply.status(500).send({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' 
        ? 'An unexpected error occurred' 
        : error.message
    });
  });
}; 