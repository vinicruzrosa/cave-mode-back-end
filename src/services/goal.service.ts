import { GoalRepository } from '../repositories/goal.repository';
import { Goal, CreateGoalRequest, UpdateGoalRequest, GoalResponse } from '../types/goal';

export class GoalService {
  private goalRepository: GoalRepository;

  constructor(goalRepository: GoalRepository) {
    this.goalRepository = goalRepository;
  }

  async createGoal(userId: number, data: CreateGoalRequest): Promise<GoalResponse> {
    const goal = await this.goalRepository.create(userId, data);
    return this.mapToResponse(goal);
  }

  async getGoal(userId: number, id: number): Promise<GoalResponse | null> {
    const goal = await this.goalRepository.findById(id, userId);
    return goal ? this.mapToResponse(goal) : null;
  }

  async getUserGoals(userId: number): Promise<GoalResponse[]> {
    const goals = await this.goalRepository.findByUserId(userId);
    return goals.map(goal => this.mapToResponse(goal));
  }

  async updateGoal(userId: number, id: number, data: UpdateGoalRequest): Promise<GoalResponse | null> {
    const exists = await this.goalRepository.exists(id, userId);
    if (!exists) {
      return null;
    }

    const goal = await this.goalRepository.update(id, userId, data);
    return goal ? this.mapToResponse(goal) : null;
  }

  async markGoalAsCompleted(userId: number, id: number): Promise<GoalResponse | null> {
    const exists = await this.goalRepository.exists(id, userId);
    if (!exists) {
      return null;
    }

    const goal = await this.goalRepository.markAsCompleted(id, userId);
    return goal ? this.mapToResponse(goal) : null;
  }

  async deleteGoal(userId: number, id: number): Promise<boolean> {
    return this.goalRepository.delete(id, userId);
  }

  async getWeeklyGoals(userId: number): Promise<GoalResponse[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const allGoals = await this.goalRepository.findByUserId(userId);
    const weeklyGoals = allGoals.filter(goal => 
      new Date(goal.createdAt) >= oneWeekAgo
    );

    return weeklyGoals.map(goal => this.mapToResponse(goal));
  }

  async getCompletedGoals(userId: number): Promise<GoalResponse[]> {
    const allGoals = await this.goalRepository.findByUserId(userId);
    const completedGoals = allGoals.filter(goal => goal.completed);
    return completedGoals.map(goal => this.mapToResponse(goal));
  }

  async getPendingGoals(userId: number): Promise<GoalResponse[]> {
    const allGoals = await this.goalRepository.findByUserId(userId);
    const pendingGoals = allGoals.filter(goal => !goal.completed);
    return pendingGoals.map(goal => this.mapToResponse(goal));
  }

  async getGoalStatistics(userId: number): Promise<{
    totalGoals: number;
    completedGoals: number;
    pendingGoals: number;
    completionRate: number;
  }> {
    const totalGoals = await this.goalRepository.getTotalCount(userId);
    const completedGoals = await this.goalRepository.getCompletedCount(userId);
    const pendingGoals = totalGoals - completedGoals;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    return {
      totalGoals,
      completedGoals,
      pendingGoals,
      completionRate: Math.round(completionRate * 100) / 100,
    };
  }

  async getWeeklyStatistics(userId: number): Promise<{
    weeklyGoals: number;
    weeklyCompleted: number;
    weeklyCompletionRate: number;
  }> {
    const weeklyGoals = await this.getWeeklyGoals(userId);
    const weeklyCompleted = weeklyGoals.filter(goal => goal.completed).length;
    const weeklyCompletionRate = weeklyGoals.length > 0 
      ? (weeklyCompleted / weeklyGoals.length) * 100 
      : 0;

    return {
      weeklyGoals: weeklyGoals.length,
      weeklyCompleted,
      weeklyCompletionRate: Math.round(weeklyCompletionRate * 100) / 100,
    };
  }

  private mapToResponse(goal: Goal): GoalResponse {
    return {
      id: goal.id,
      title: goal.title,
      completed: goal.completed,
      createdAt: goal.createdAt.toISOString(),
      updatedAt: goal.updatedAt.toISOString(),
    };
  }
} 