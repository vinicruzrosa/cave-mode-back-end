import { FastifyInstance } from 'fastify';
import { GoalController } from '../controllers/goal.controller';
import { GoalRepository } from '../repositories/goal.repository';
import { GoalService } from '../services/goal.service';
import { 
  createGoalSchema, 
  updateGoalSchema, 
  getGoalSchema, 
  deleteGoalSchema,
  completeGoalSchema
} from '../schemas/goal';
import { authenticate } from '../middleware/auth';

export async function goalRoutes(fastify: FastifyInstance) {
  const goalRepository = new GoalRepository();
  const goalService = new GoalService(goalRepository);
  const goalController = new GoalController(goalService);

  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new goal
  fastify.post('/', {
    schema: createGoalSchema,
    handler: goalController.createGoal.bind(goalController),
  });

  // Get all goals for the authenticated user
  fastify.get('/', {
    handler: goalController.getUserGoals.bind(goalController),
  });

  // Get weekly goals
  fastify.get('/weekly', {
    handler: goalController.getWeeklyGoals.bind(goalController),
  });

  // Get completed goals
  fastify.get('/completed', {
    handler: goalController.getCompletedGoals.bind(goalController),
  });

  // Get pending goals
  fastify.get('/pending', {
    handler: goalController.getPendingGoals.bind(goalController),
  });

  // Get goal statistics
  fastify.get('/statistics', {
    handler: goalController.getGoalStatistics.bind(goalController),
  });

  // Get weekly statistics
  fastify.get('/weekly-statistics', {
    handler: goalController.getWeeklyStatistics.bind(goalController),
  });

  // Get a specific goal by ID
  fastify.get('/:id', {
    schema: getGoalSchema,
    handler: goalController.getGoal.bind(goalController),
  });

  // Update a goal
  fastify.put('/:id', {
    schema: updateGoalSchema,
    handler: goalController.updateGoal.bind(goalController),
  });

  // Mark goal as completed
  fastify.patch('/:id/complete', {
    schema: completeGoalSchema,
    handler: goalController.markGoalAsCompleted.bind(goalController),
  });

  // Delete a goal
  fastify.delete('/:id', {
    schema: deleteGoalSchema,
    handler: goalController.deleteGoal.bind(goalController),
  });
} 