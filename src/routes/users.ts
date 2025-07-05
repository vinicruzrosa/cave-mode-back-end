import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../services/user.service';
import { updateSafeModeSchema } from '../schemas/user';
import { authenticate } from '../middleware/auth';

export async function userRoutes(fastify: FastifyInstance) {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Get user profile
  fastify.get('/profile', {
    handler: userController.getUserProfile.bind(userController),
  });

  // Update safe mode
  fastify.patch('/safe-mode', {
    schema: updateSafeModeSchema,
    handler: userController.updateSafeMode.bind(userController),
  });

  // Get safe mode status
  fastify.get('/safe-mode', {
    handler: userController.getSafeModeStatus.bind(userController),
  });
} 