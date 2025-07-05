import { FastifyInstance } from 'fastify';
import { RoutineController } from '../controllers/routine.controller';
import { RoutineRepository } from '../repositories/routine.repository';
import { RoutineService } from '../services/routine.service';
import { 
  createRoutineSchema, 
  updateRoutineSchema, 
  getRoutineSchema, 
  deleteRoutineSchema 
} from '../schemas/routine';
import { authenticate } from '../middleware/auth';

export async function routineRoutes(fastify: FastifyInstance) {
  const routineRepository = new RoutineRepository();
  const routineService = new RoutineService(routineRepository);
  const routineController = new RoutineController(routineService);

  // Apply authentication middleware to all routes
  fastify.addHook('preHandler', authenticate);

  // Create a new routine
  fastify.post('/', {
    schema: createRoutineSchema,
    handler: routineController.createRoutine.bind(routineController),
  });

  // Get all routines for the authenticated user
  fastify.get('/', {
    handler: routineController.getUserRoutines.bind(routineController),
  });

  // Get current routine
  fastify.get('/current', {
    handler: routineController.getCurrentRoutine.bind(routineController),
  });

  // Get upcoming routines
  fastify.get('/upcoming', {
    handler: routineController.getUpcomingRoutines.bind(routineController),
  });

  // Get a specific routine by ID
  fastify.get('/:id', {
    schema: getRoutineSchema,
    handler: routineController.getRoutine.bind(routineController),
  });

  // Update a routine
  fastify.put('/:id', {
    schema: updateRoutineSchema,
    handler: routineController.updateRoutine.bind(routineController),
  });

  // Delete a routine
  fastify.delete('/:id', {
    schema: deleteRoutineSchema,
    handler: routineController.deleteRoutine.bind(routineController),
  });
} 