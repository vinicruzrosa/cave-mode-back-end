import { RoutineRepository } from '../repositories/routine.repository';
import { Routine, CreateRoutineRequest, UpdateRoutineRequest, RoutineResponse } from '../types/routine';

export class RoutineService {
  private routineRepository: RoutineRepository;

  constructor(routineRepository: RoutineRepository) {
    this.routineRepository = routineRepository;
  }

  async createRoutine(userId: number, data: CreateRoutineRequest): Promise<RoutineResponse> {
    const routine = await this.routineRepository.create(userId, data);
    return this.mapToResponse(routine);
  }

  async getRoutine(userId: number, id: number): Promise<RoutineResponse | null> {
    const routine = await this.routineRepository.findById(id, userId);
    return routine ? this.mapToResponse(routine) : null;
  }

  async getUserRoutines(userId: number): Promise<RoutineResponse[]> {
    const routines = await this.routineRepository.findByUserId(userId);
    return routines.map(routine => this.mapToResponse(routine));
  }

  async updateRoutine(userId: number, id: number, data: UpdateRoutineRequest): Promise<RoutineResponse | null> {
    const exists = await this.routineRepository.exists(id, userId);
    if (!exists) {
      return null;
    }

    const routine = await this.routineRepository.update(id, userId, data);
    return routine ? this.mapToResponse(routine) : null;
  }

  async deleteRoutine(userId: number, id: number): Promise<boolean> {
    return this.routineRepository.delete(id, userId);
  }

  async getCurrentRoutine(userId: number): Promise<RoutineResponse | null> {
    const now = new Date();
    const routines = await this.routineRepository.findByUserId(userId);
    
    const currentRoutine = routines.find(routine => {
      const startTime = new Date(routine.startTime);
      const endTime = new Date(routine.endTime);
      return now >= startTime && now <= endTime;
    });

    return currentRoutine ? this.mapToResponse(currentRoutine) : null;
  }

  async getUpcomingRoutines(userId: number, limit: number = 5): Promise<RoutineResponse[]> {
    const now = new Date();
    const routines = await this.routineRepository.findByUserId(userId);
    
    const upcomingRoutines = routines
      .filter(routine => new Date(routine.startTime) > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, limit);

    return upcomingRoutines.map(routine => this.mapToResponse(routine));
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