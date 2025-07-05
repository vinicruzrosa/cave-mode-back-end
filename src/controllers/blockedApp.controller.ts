import { FastifyRequest, FastifyReply } from 'fastify';
import { BlockedAppService } from '../services/blockedApp.service';
import { CreateBlockedAppRequest } from '../types/blockedApp';

export class BlockedAppController {
  private blockedAppService: BlockedAppService;

  constructor(blockedAppService: BlockedAppService) {
    this.blockedAppService = blockedAppService;
  }

  async createBlockedApp(
    request: FastifyRequest<{ Body: CreateBlockedAppRequest }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const blockedApp = await this.blockedAppService.createBlockedApp(userId, request.body);
      
      return reply.status(201).send({
        success: true,
        data: blockedApp,
        message: 'App blocked successfully',
      });
    } catch (error) {
      request.log.error('Error creating blocked app:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getBlockedApp(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const blockedAppId = parseInt(request.params.id, 10);
      
      const blockedApp = await this.blockedAppService.getBlockedApp(userId, blockedAppId);
      
      if (!blockedApp) {
        return reply.status(404).send({
          success: false,
          message: 'Blocked app not found',
        });
      }

      return reply.status(200).send({
        success: true,
        data: blockedApp,
      });
    } catch (error) {
      request.log.error('Error getting blocked app:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getUserBlockedApps(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const blockedApps = await this.blockedAppService.getUserBlockedApps(userId);
      
      return reply.status(200).send({
        success: true,
        data: blockedApps,
        count: blockedApps.length,
      });
    } catch (error) {
      request.log.error('Error getting user blocked apps:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async deleteBlockedApp(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const blockedAppId = parseInt(request.params.id, 10);
      
      const deleted = await this.blockedAppService.deleteBlockedApp(userId, blockedAppId);
      
      if (!deleted) {
        return reply.status(404).send({
          success: false,
          message: 'Blocked app not found',
        });
      }

      return reply.status(200).send({
        success: true,
        message: 'App unblocked successfully',
      });
    } catch (error) {
      request.log.error('Error deleting blocked app:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async checkBlockStatus(
    request: FastifyRequest<{ Querystring: { appName: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const { appName } = request.query;
      
      const status = await this.blockedAppService.checkBlockStatus(userId, appName);
      
      return reply.status(200).send({
        success: true,
        data: status,
      });
    } catch (error) {
      request.log.error('Error checking block status:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getActiveBlocks(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const activeBlocks = await this.blockedAppService.getActiveBlocks(userId);
      
      return reply.status(200).send({
        success: true,
        data: activeBlocks,
        count: activeBlocks.length,
      });
    } catch (error) {
      request.log.error('Error getting active blocks:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }

  async getBlockStatistics(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as any).userId;
      const statistics = await this.blockedAppService.getBlockStatistics(userId);
      
      return reply.status(200).send({
        success: true,
        data: statistics,
      });
    } catch (error) {
      request.log.error('Error getting block statistics:', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
      });
    }
  }
} 