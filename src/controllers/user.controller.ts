import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { UpdateSafeModeRequest } from '../types/user';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async updateSafeMode(
    request: FastifyRequest<{ Body: UpdateSafeModeRequest }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const result = await this.userService.updateSafeMode(userId, request.body.safeMode);
      
      return reply.status(200).send({
        success: true,
        data: result,
      });
    } catch (error) {
      request.log.error('Error updating safe mode:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getSafeModeStatus(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const safeMode = await this.userService.getSafeModeStatus(userId);
      
      return reply.status(200).send({
        success: true,
        data: {
          safeMode,
        },
      });
    } catch (error) {
      request.log.error('Error getting safe mode status:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUserProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const user = await this.userService.getUser(userId);
      
      if (!user) {
        return reply.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          safeMode: user.safeMode,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      request.log.error('Error getting user profile:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
} 