import { FastifyRequest, FastifyReply } from 'fastify';
import { AlarmService } from '../services/alarm.service';
import { CreateAlarmRequest, UpdateAlarmRequest } from '../types/alarm';

export class AlarmController {
  private service: AlarmService;

  constructor() {
    this.service = new AlarmService();
  }

  async createAlarm(
    request: FastifyRequest<{ Body: CreateAlarmRequest }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarm = await this.service.createAlarm(userId, request.body);
      
      return reply.status(201).send({
        message: 'Alarme criado com sucesso',
        alarm
      });
    } catch (error: any) {
      if (error.message.includes('future')) {
        return reply.status(400).send({
          error: error.message
        });
      }
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async getAlarms(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarms = await this.service.getAlarms(userId);
      
      return reply.status(200).send({
        alarms
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async getActiveAlarms(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarms = await this.service.getActiveAlarms(userId);
      
      return reply.status(200).send({
        alarms
      });
    } catch (error: any) {
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async getAlarmById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarmId = parseInt(request.params.id);
      const alarm = await this.service.getAlarmById(userId, alarmId);
      
      return reply.status(200).send({
        alarm
      });
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return reply.status(404).send({
          error: error.message
        });
      }
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async updateAlarm(
    request: FastifyRequest<{ 
      Params: { id: string };
      Body: UpdateAlarmRequest;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarmId = parseInt(request.params.id);
      const alarm = await this.service.updateAlarm(userId, alarmId, request.body);
      
      return reply.status(200).send({
        message: 'Alarme atualizado com sucesso',
        alarm
      });
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return reply.status(404).send({
          error: error.message
        });
      }
      if (error.message.includes('future')) {
        return reply.status(400).send({
          error: error.message
        });
      }
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async deleteAlarm(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarmId = parseInt(request.params.id);
      await this.service.deleteAlarm(userId, alarmId);
      
      return reply.status(200).send({
        message: 'Alarme deletado com sucesso'
      });
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return reply.status(404).send({
          error: error.message
        });
      }
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async uploadSelfie(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarmId = parseInt(request.params.id);
      
      // Verificar se há arquivo enviado
      const data = await (request as any).file();
      if (!data) {
        return reply.status(400).send({
          error: 'Nenhuma imagem foi enviada'
        });
      }

      // Verificar tipo de arquivo
      if (!data.mimetype.startsWith('image/')) {
        return reply.status(400).send({
          error: 'Arquivo deve ser uma imagem'
        });
      }

      // Ler o buffer da imagem
      const buffer = await data.toBuffer();
      
      // Processar a selfie
      const selfie = await this.service.processSelfie(userId, alarmId, buffer);
      
      if (selfie.approved) {
        return reply.status(200).send({
          message: 'Selfie aprovada! Alarme desativado com sucesso.',
          selfie
        });
      } else {
        return reply.status(400).send({
          error: 'Selfie não aprovada. Luz natural insuficiente.',
          selfie
        });
      }
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return reply.status(404).send({
          error: error.message
        });
      }
      if (error.message.includes('not active')) {
        return reply.status(400).send({
          error: error.message
        });
      }
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }

  async getSelfiesByAlarm(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const alarmId = parseInt(request.params.id);
      const selfies = await this.service.getSelfiesByAlarm(userId, alarmId);
      
      return reply.status(200).send({
        selfies
      });
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return reply.status(404).send({
          error: error.message
        });
      }
      return reply.status(500).send({
        error: 'Erro interno do servidor'
      });
    }
  }
} 