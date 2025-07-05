import { FastifyInstance } from 'fastify';
import { AlarmController } from '../controllers/alarm.controller';
import { createAlarmSchema, updateAlarmSchema, alarmIdParamSchema } from '../schemas/alarm';
import { authenticate } from '../middleware/auth';

export const alarmRoutes = async (fastify: FastifyInstance) => {
  const controller = new AlarmController();

  // Aplicar middleware de autenticação a todas as rotas
  fastify.addHook('preHandler', authenticate);

  // POST /api/alarms - Criar novo alarme
  fastify.post('/', {
    schema: {
      tags: ['Alarms'],
      summary: 'Criar novo alarme',
      description: 'Cria um novo alarme para o usuário autenticado',
      security: [{ bearerAuth: [] }],
      body: {
        $ref: 'CreateAlarmRequest'
      },
      response: {
        201: {
          description: 'Alarme criado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            alarm: { $ref: 'AlarmResponse' }
          }
        },
        400: {
          description: 'Dados inválidos',
          $ref: 'ErrorResponse'
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.createAlarm.bind(controller));

  // GET /api/alarms - Listar todos os alarmes do usuário
  fastify.get('/', {
    schema: {
      tags: ['Alarms'],
      summary: 'Listar alarmes',
      description: 'Lista todos os alarmes do usuário autenticado',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Lista de alarmes',
          type: 'object',
          properties: {
            alarms: {
              type: 'array',
              items: { $ref: 'AlarmResponse' }
            }
          }
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.getAlarms.bind(controller));

  // GET /api/alarms/active - Listar alarmes ativos
  fastify.get('/active', {
    schema: {
      tags: ['Alarms'],
      summary: 'Listar alarmes ativos',
      description: 'Lista apenas os alarmes ativos do usuário autenticado',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Lista de alarmes ativos',
          type: 'object',
          properties: {
            alarms: {
              type: 'array',
              items: { $ref: 'AlarmResponse' }
            }
          }
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.getActiveAlarms.bind(controller));

  // PUT /api/alarms/:id - Atualizar alarme
  fastify.put('/:id', {
    schema: {
      tags: ['Alarms'],
      summary: 'Atualizar alarme',
      description: 'Atualiza um alarme específico do usuário autenticado',
      security: [{ bearerAuth: [] }],
      params: {
        $ref: 'AlarmIdParam'
      },
      body: {
        $ref: 'UpdateAlarmRequest'
      },
      response: {
        200: {
          description: 'Alarme atualizado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' },
            alarm: { $ref: 'AlarmResponse' }
          }
        },
        400: {
          description: 'Dados inválidos',
          $ref: 'ErrorResponse'
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        404: {
          description: 'Alarme não encontrado',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.updateAlarm.bind(controller));

  // DELETE /api/alarms/:id - Deletar alarme
  fastify.delete('/:id', {
    schema: {
      tags: ['Alarms'],
      summary: 'Deletar alarme',
      description: 'Deleta um alarme específico do usuário autenticado',
      security: [{ bearerAuth: [] }],
      params: {
        $ref: 'AlarmIdParam'
      },
      response: {
        200: {
          description: 'Alarme deletado com sucesso',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        404: {
          description: 'Alarme não encontrado',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.deleteAlarm.bind(controller));

  // POST /api/alarms/:id/selfie - Upload de selfie
  fastify.post('/:id/selfie', {
    schema: {
      tags: ['Alarms'],
      summary: 'Upload de selfie',
      description: 'Envia uma selfie para desativar o alarme. A imagem será analisada para verificar luz natural.',
      security: [{ bearerAuth: [] }],
      params: {
        $ref: 'AlarmIdParam'
      },
      consumes: ['multipart/form-data'],
      response: {
        200: {
          description: 'Selfie aprovada e alarme desativado',
          type: 'object',
          properties: {
            message: { type: 'string' },
            selfie: { $ref: 'SelfieResponse' }
          }
        },
        400: {
          description: 'Selfie não aprovada ou dados inválidos',
          type: 'object',
          properties: {
            error: { type: 'string' },
            selfie: { $ref: 'SelfieResponse' }
          }
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        404: {
          description: 'Alarme não encontrado',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.uploadSelfie.bind(controller));

  // GET /api/alarms/:id/selfies - Listar selfies de um alarme
  fastify.get('/:id/selfies', {
    schema: {
      tags: ['Alarms'],
      summary: 'Listar selfies',
      description: 'Lista todas as selfies de um alarme específico',
      security: [{ bearerAuth: [] }],
      params: {
        $ref: 'AlarmIdParam'
      },
      response: {
        200: {
          description: 'Lista de selfies',
          type: 'object',
          properties: {
            selfies: {
              type: 'array',
              items: { $ref: 'SelfieResponse' }
            }
          }
        },
        401: {
          description: 'Token de autenticação inválido',
          $ref: 'ErrorResponse'
        },
        404: {
          description: 'Alarme não encontrado',
          $ref: 'ErrorResponse'
        },
        500: {
          description: 'Erro interno do servidor',
          $ref: 'ErrorResponse'
        }
      }
    }
  }, controller.getSelfiesByAlarm.bind(controller));
}; 