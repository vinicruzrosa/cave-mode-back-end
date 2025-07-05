import { FastifyRequest, FastifyReply } from 'fastify';
import { GoalService } from '../services/goal.service';
import { CreateGoalRequest, UpdateGoalRequest } from '../types/goal';

export class GoalController {
  private goalService: GoalService;

  constructor(goalService: GoalService) {
    this.goalService = goalService;
  }

  async createGoal(
    request: FastifyRequest<{ Body: CreateGoalRequest }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goal = await this.goalService.createGoal(userId, request.body);
      
      return reply.status(201).send({
        success: true,
        data: goal,
        message: 'Goal created successfully',
      });
    } catch (error) {
      request.log.error('Error creating goal:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getGoal(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goalId = parseInt(request.params.id, 10);
      
      const goal = await this.goalService.getGoal(userId, goalId);
      
      if (!goal) {
        return reply.status(404).send({
          success: false,
          message: 'Goal not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: goal,
      });
    } catch (error) {
      request.log.error('Error getting goal:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUserGoals(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goals = await this.goalService.getUserGoals(userId);
      
      return reply.status(200).send({
        success: true,
        data: goals,
        count: goals.length,
      });
    } catch (error) {
      request.log.error('Error getting user goals:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async updateGoal(
    request: FastifyRequest<{ 
      Params: { id: string };
      Body: UpdateGoalRequest;
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goalId = parseInt(request.params.id, 10);
      
      const goal = await this.goalService.updateGoal(userId, goalId, request.body);
      
      if (!goal) {
        return reply.status(404).send({
          success: false,
          message: 'Goal not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: goal,
        message: 'Goal updated successfully',
      });
    } catch (error) {
      request.log.error('Error updating goal:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async markGoalAsCompleted(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goalId = parseInt(request.params.id, 10);
      
      const goal = await this.goalService.markGoalAsCompleted(userId, goalId);
      
      if (!goal) {
        return reply.status(404).send({
          success: false,
          message: 'Goal not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: goal,
        message: 'Goal marked as completed',
      });
    } catch (error) {
      request.log.error('Error marking goal as completed:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async deleteGoal(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goalId = parseInt(request.params.id, 10);
      
      const deleted = await this.goalService.deleteGoal(userId, goalId);
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          message: 'Goal not found',
        });
      }

      return reply.status(200).send({
        success: true,
        message: 'Goal deleted successfully',
      });
    } catch (error) {
      request.log.error('Error deleting goal:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getWeeklyGoals(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goals = await this.goalService.getWeeklyGoals(userId);
      
      return reply.status(200).send({
        success: true,
        data: goals,
        count: goals.length,
      });
    } catch (error) {
      request.log.error('Error getting weekly goals:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getCompletedGoals(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goals = await this.goalService.getCompletedGoals(userId);
      
      return reply.status(200).send({
        success: true,
        data: goals,
        count: goals.length,
      });
    } catch (error) {
      request.log.error('Error getting completed goals:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getPendingGoals(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const goals = await this.goalService.getPendingGoals(userId);
      
      return reply.status(200).send({
        success: true,
        data: goals,
        count: goals.length,
      });
    } catch (error) {
      request.log.error('Error getting pending goals:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getGoalStatistics(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const statistics = await this.goalService.getGoalStatistics(userId);
      
      return reply.status(200).send({
        success: true,
        data: statistics,
      });
    } catch (error) {
      request.log.error('Error getting goal statistics:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getWeeklyStatistics(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const statistics = await this.goalService.getWeeklyStatistics(userId);
      
      return reply.status(200).send({
        success: true,
        data: statistics,
      });
    } catch (error) {
      request.log.error('Error getting weekly statistics:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
} 