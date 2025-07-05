import { FastifyInstance } from 'fastify';
import { BlockedAppController } from '../controllers/blockedApp.controller';
import { BlockedAppRepository } from '../repositories/blockedApp.repository';
import { BlockedAppService } from '../services/blockedApp.service';
import { 
  createBlockedAppSchema, 
  getBlockedAppSchema, 
  deleteBlockedAppSchema,
  checkBlockStatusSchema
} from '../schemas/blockedApp';
import { authenticate } from '../middleware/auth';

export async function blockedAppRoutes(fastify: FastifyInstance) {
  const blockedAppRepository = new BlockedAppRepository();
  const blockedAppService = new BlockedAppService(blockedAppRepository);
  const blockedAppController = new BlockedAppController(blockedAppService);

  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new blocked app
  fastify.post('/', {
    schema: createBlockedAppSchema,
    handler: blockedAppController.createBlockedApp.bind(blockedAppController),
  });

  // Get all blocked apps for the authenticated user
  fastify.get('/', {
    handler: blockedAppController.getUserBlockedApps.bind(blockedAppController),
  });

  // Get active blocks
  fastify.get('/active', {
    handler: blockedAppController.getActiveBlocks.bind(blockedAppController),
  });

  // Get block statistics
  fastify.get('/statistics', {
    handler: blockedAppController.getBlockStatistics.bind(blockedAppController),
  });

  // Check block status for a specific app
  fastify.get('/check', {
    schema: checkBlockStatusSchema,
    handler: blockedAppController.checkBlockStatus.bind(blockedAppController),
  });

  // Get a specific blocked app by ID
  fastify.get('/:id', {
    schema: getBlockedAppSchema,
    handler: blockedAppController.getBlockedApp.bind(blockedAppController),
  });

  // Delete a blocked app (unblock)
  fastify.delete('/:id', {
    schema: deleteBlockedAppSchema,
    handler: blockedAppController.deleteBlockedApp.bind(blockedAppController),
  });
} 