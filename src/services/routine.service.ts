import { RoutineRepository } from '../repositories/routine.repository';
import { Routine, CreateRoutineRequest, UpdateRoutineRequest, RoutineResponse } from '../types/routine';
import { routineLogger } from '../utils/logger';

export class RoutineService {
  private routineRepository: RoutineRepository;

  constructor(routineRepository: RoutineRepository) {
    this.routineRepository = routineRepository;
  }

  async createRoutine(userId: number, data: CreateRoutineRequest): Promise<RoutineResponse> {
    return routineLogger.timeOperation(
      'createRoutine',
      async () => {
        await routineLogger.info('createRoutine', 'Creating new routine', { userId, routineData: data });
        
        const routine = await this.routineRepository.create(userId, data);
        
        await routineLogger.info('createRoutine', 'Routine created successfully', { 
          userId, 
          routineId: routine.id, 
          title: routine.title,
          startTime: routine.startTime.toISOString(),
          endTime: routine.endTime.toISOString() 
        });
        
        return this.mapToResponse(routine);
      },
      'Create new routine',
      userId,
      data
    );
  }

  async getRoutine(userId: number, id: number): Promise<RoutineResponse | null> {
    return routineLogger.timeOperation(
      'getRoutine',
      async () => {
        await routineLogger.debug('getRoutine', 'Fetching routine by ID', { userId, routineId: id });
        
        const routine = await this.routineRepository.findById(id, userId);
        
        if (routine) {
          await routineLogger.info('getRoutine', 'Routine retrieved successfully', { 
            userId, 
            routineId: id, 
            title: routine.title,
            startTime: routine.startTime.toISOString(),
            endTime: routine.endTime.toISOString() 
          });
        } else {
          await routineLogger.warn('getRoutine', 'Routine not found', { userId, routineId: id });
        }
        
        return routine ? this.mapToResponse(routine) : null;
      },
      'Get routine by ID',
      userId,
      { routineId: id }
    );
  }

  async getUserRoutines(userId: number): Promise<RoutineResponse[]> {
    return routineLogger.timeOperation(
      'getUserRoutines',
      async () => {
        await routineLogger.debug('getUserRoutines', 'Fetching all routines for user', { userId });
        
        const routines = await this.routineRepository.findByUserId(userId);
        
        await routineLogger.info('getUserRoutines', 'User routines retrieved successfully', { 
          userId, 
          count: routines.length 
        });
        
        return routines.map(routine => this.mapToResponse(routine));
      },
      'Get all routines for user',
      userId
    );
  }

  async updateRoutine(userId: number, id: number, data: UpdateRoutineRequest): Promise<RoutineResponse | null> {
    return routineLogger.timeOperation(
      'updateRoutine',
      async () => {
        await routineLogger.info('updateRoutine', 'Updating routine', { userId, routineId: id, updateData: data });
        
        const exists = await this.routineRepository.exists(id, userId);
        if (!exists) {
          await routineLogger.error('updateRoutine', 'Routine not found or access denied', null, { 
            userId, 
            routineId: id 
          });
          return null;
        }

        const routine = await this.routineRepository.update(id, userId, data);
        
        if (routine) {
          await routineLogger.info('updateRoutine', 'Routine updated successfully', { 
            userId, 
            routineId: id, 
            updatedFields: Object.keys(data) 
          });
        } else {
          await routineLogger.error('updateRoutine', 'Failed to update routine', null, { 
            userId, 
            routineId: id, 
            updateData: data 
          });
        }
        
        return routine ? this.mapToResponse(routine) : null;
      },
      'Update routine',
      userId,
      { routineId: id, ...data }
    );
  }

  async deleteRoutine(userId: number, id: number): Promise<boolean> {
    return routineLogger.timeOperation(
      'deleteRoutine',
      async () => {
        await routineLogger.info('deleteRoutine', 'Deleting routine', { userId, routineId: id });
        
        const success = await this.routineRepository.delete(id, userId);
        
        if (success) {
          await routineLogger.info('deleteRoutine', 'Routine deleted successfully', { userId, routineId: id });
        } else {
          await routineLogger.error('deleteRoutine', 'Failed to delete routine or routine not found', null, { 
            userId, 
            routineId: id 
          });
        }
        
        return success;
      },
      'Delete routine',
      userId,
      { routineId: id }
    );
  }

  async getCurrentRoutine(userId: number): Promise<RoutineResponse | null> {
    return routineLogger.timeOperation(
      'getCurrentRoutine',
      async () => {
        await routineLogger.debug('getCurrentRoutine', 'Finding current routine for user', { userId });
        
        const now = new Date();
        const routines = await this.routineRepository.findByUserId(userId);
        
        const currentRoutine = routines.find(routine => {
          const startTime = new Date(routine.startTime);
          const endTime = new Date(routine.endTime);
          return now >= startTime && now <= endTime;
        });

        if (currentRoutine) {
          await routineLogger.info('getCurrentRoutine', 'Current routine found', { 
            userId, 
            routineId: currentRoutine.id,
            title: currentRoutine.title,
            startTime: currentRoutine.startTime.toISOString(),
            endTime: currentRoutine.endTime.toISOString() 
          });
        } else {
          await routineLogger.info('getCurrentRoutine', 'No current routine found', { userId });
        }

        return currentRoutine ? this.mapToResponse(currentRoutine) : null;
      },
      'Get current routine for user',
      userId
    );
  }

  async getUpcomingRoutines(userId: number, limit: number = 5): Promise<RoutineResponse[]> {
    return routineLogger.timeOperation(
      'getUpcomingRoutines',
      async () => {
        await routineLogger.debug('getUpcomingRoutines', 'Fetching upcoming routines', { userId, limit });
        
        const now = new Date();
        const routines = await this.routineRepository.findByUserId(userId);
        
        const upcomingRoutines = routines
          .filter(routine => new Date(routine.startTime) > now)
          .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
          .slice(0, limit);

        await routineLogger.info('getUpcomingRoutines', 'Upcoming routines retrieved successfully', { 
          userId, 
          totalRoutines: routines.length,
          upcomingRoutines: upcomingRoutines.length,
          limit 
        });

        return upcomingRoutines.map(routine => this.mapToResponse(routine));
      },
      'Get upcoming routines for user',
      userId,
      { limit }
    );
  }

  private mapToResponse(routine: Routine): RoutineResponse {
    return {
      id: routine.id,
      title: routine.title,
      startTime: routine.startTime.toISOString(),
      endTime: routine.endTime.toISOString(),
      createdAt: routine.createdAt.toISOString(),
      updatedAt: routine.updatedAt.toISOString(),
    };
  }
} 