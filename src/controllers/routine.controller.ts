import { FastifyRequest, FastifyReply } from 'fastify';
import { RoutineService } from '../services/routine.service';
import { CreateRoutineRequest, UpdateRoutineRequest } from '../types/routine';

export class RoutineController {
  private routineService: RoutineService;

  constructor(routineService: RoutineService) {
    this.routineService = routineService;
  }

  async createRoutine(
    request: FastifyRequest<{ Body: CreateRoutineRequest }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const routine = await this.routineService.createRoutine(userId, request.body);
      
      return reply.status(201).send({
        success: true,
        data: routine,
        message: 'Routine created successfully',
      });
    } catch (error) {
      request.log.error('Error creating routine:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getRoutine(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const routineId = parseInt(request.params.id, 10);
      
      const routine = await this.routineService.getRoutine(userId, routineId);
      
      if (!routine) {
        return reply.status(404).send({
          success: false,
          message: 'Routine not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: routine,
      });
    } catch (error) {
      request.log.error('Error getting routine:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUserRoutines(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const routines = await this.routineService.getUserRoutines(userId);
      
      return reply.status(200).send({
        success: true,
        data: routines,
        count: routines.length,
      });
    } catch (error) {
      request.log.error('Error getting user routines:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateRoutine(
    request: FastifyRequest<{ 
      Params: { id: string };
      Body: UpdateRoutineRequest;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const routineId = parseInt(request.params.id, 10);
      
      const routine = await this.routineService.updateRoutine(userId, routineId, request.body);
      
      if (!routine) {
        return reply.status(404).send({
          success: false,
          message: 'Routine not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: routine,
        message: 'Routine updated successfully',
      });
    } catch (error) {
      request.log.error('Error updating routine:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async deleteRoutine(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const routineId = parseInt(request.params.id, 10);
      
      const deleted = await this.routineService.deleteRoutine(userId, routineId);
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          message: 'Routine not found',
        });
      }

      return reply.status(200).send({
        success: true,
        message: 'Routine deleted successfully',
      });
    } catch (error) {
      request.log.error('Error deleting routine:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getCurrentRoutine(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const routine = await this.routineService.getCurrentRoutine(userId);
      
      return reply.status(200).send({
        success: true,
        data: routine,
      });
    } catch (error) {
      request.log.error('Error getting current routine:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUpcomingRoutines(
    request: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const limit = request.query.limit ? parseInt(request.query.limit, 10) : 5;
      
      const routines = await this.routineService.getUpcomingRoutines(userId, limit);
      
      return reply.status(200).send({
        success: true,
        data: routines,
        count: routines.length,
      });
    } catch (error) {
      request.log.error('Error getting upcoming routines:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
} 