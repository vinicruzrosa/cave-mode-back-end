import { GoalRepository } from '../repositories/goal.repository';
import { Goal, CreateGoalRequest, UpdateGoalRequest, GoalResponse } from '../types/goal';
import { goalLogger } from '../utils/logger';

export class GoalService {
  private goalRepository: GoalRepository;

  constructor(goalRepository: GoalRepository) {
    this.goalRepository = goalRepository;
  }

  async createGoal(userId: number, data: CreateGoalRequest): Promise<GoalResponse> {
    return goalLogger.timeOperation(
      'createGoal',
      async () => {
        await goalLogger.info('createGoal', 'Creating new goal', { userId, goalData: data });
        
        const goal = await this.goalRepository.create(userId, data);
        
        await goalLogger.info('createGoal', 'Goal created successfully', { 
          userId, 
          goalId: goal.id, 
          title: goal.title 
        });
        
        return this.mapToResponse(goal);
      },
      'Create new goal',
      userId,
      data
    );
  }

  async getGoal(userId: number, id: number): Promise<GoalResponse | null> {
    return goalLogger.timeOperation(
      'getGoal',
      async () => {
        await goalLogger.debug('getGoal', 'Fetching goal by ID', { userId, goalId: id });
        
        const goal = await this.goalRepository.findById(id, userId);
        
        if (goal) {
          await goalLogger.info('getGoal', 'Goal retrieved successfully', { 
            userId, 
            goalId: id, 
            title: goal.title,
            completed: goal.completed 
          });
        } else {
          await goalLogger.warn('getGoal', 'Goal not found', { userId, goalId: id });
        }
        
        return goal ? this.mapToResponse(goal) : null;
      },
      'Get goal by ID',
      userId,
      { goalId: id }
    );
  }

  async getUserGoals(userId: number): Promise<GoalResponse[]> {
    return goalLogger.timeOperation(
      'getUserGoals',
      async () => {
        await goalLogger.debug('getUserGoals', 'Fetching all goals for user', { userId });
        
        const goals = await this.goalRepository.findByUserId(userId);
        
        await goalLogger.info('getUserGoals', 'User goals retrieved successfully', { 
          userId, 
          count: goals.length,
          completedCount: goals.filter(g => g.completed).length 
        });
        
        return goals.map(goal => this.mapToResponse(goal));
      },
      'Get all goals for user',
      userId
    );
  }

  async updateGoal(userId: number, id: number, data: UpdateGoalRequest): Promise<GoalResponse | null> {
    return goalLogger.timeOperation(
      'updateGoal',
      async () => {
        await goalLogger.info('updateGoal', 'Updating goal', { userId, goalId: id, updateData: data });
        
        const exists = await this.goalRepository.exists(id, userId);
        if (!exists) {
          await goalLogger.error('updateGoal', 'Goal not found or access denied', null, { 
            userId, 
            goalId: id 
          });
          return null;
        }

        const goal = await this.goalRepository.update(id, userId, data);
        
        if (goal) {
          await goalLogger.info('updateGoal', 'Goal updated successfully', { 
            userId, 
            goalId: id, 
            updatedFields: Object.keys(data) 
          });
        } else {
          await goalLogger.error('updateGoal', 'Failed to update goal', null, { 
            userId, 
            goalId: id, 
            updateData: data 
          });
        }
        
        return goal ? this.mapToResponse(goal) : null;
      },
      'Update goal',
      userId,
      { goalId: id, ...data }
    );
  }

  async markGoalAsCompleted(userId: number, id: number): Promise<GoalResponse | null> {
    return goalLogger.timeOperation(
      'markGoalAsCompleted',
      async () => {
        await goalLogger.info('markGoalAsCompleted', 'Marking goal as completed', { userId, goalId: id });
        
        const exists = await this.goalRepository.exists(id, userId);
        if (!exists) {
          await goalLogger.error('markGoalAsCompleted', 'Goal not found or access denied', null, { 
            userId, 
            goalId: id 
          });
          return null;
        }

        const goal = await this.goalRepository.markAsCompleted(id, userId);
        
        if (goal) {
          await goalLogger.info('markGoalAsCompleted', 'Goal marked as completed successfully', { 
            userId, 
            goalId: id,
            completedAt: goal.updatedAt 
          });
        } else {
          await goalLogger.error('markGoalAsCompleted', 'Failed to mark goal as completed', null, { 
            userId, 
            goalId: id 
          });
        }
        
        return goal ? this.mapToResponse(goal) : null;
      },
      'Mark goal as completed',
      userId,
      { goalId: id }
    );
  }

  async deleteGoal(userId: number, id: number): Promise<boolean> {
    return goalLogger.timeOperation(
      'deleteGoal',
      async () => {
        await goalLogger.info('deleteGoal', 'Deleting goal', { userId, goalId: id });
        
        const success = await this.goalRepository.delete(id, userId);
        
        if (success) {
          await goalLogger.info('deleteGoal', 'Goal deleted successfully', { userId, goalId: id });
        } else {
          await goalLogger.error('deleteGoal', 'Failed to delete goal or goal not found', null, { 
            userId, 
            goalId: id 
          });
        }
        
        return success;
      },
      'Delete goal',
      userId,
      { goalId: id }
    );
  }

  async getWeeklyGoals(userId: number): Promise<GoalResponse[]> {
    return goalLogger.timeOperation(
      'getWeeklyGoals',
      async () => {
        await goalLogger.debug('getWeeklyGoals', 'Fetching weekly goals', { userId });
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const allGoals = await this.goalRepository.findByUserId(userId);
        const weeklyGoals = allGoals.filter(goal => 
          new Date(goal.createdAt) >= oneWeekAgo
        );

        await goalLogger.info('getWeeklyGoals', 'Weekly goals retrieved successfully', { 
          userId, 
          totalGoals: allGoals.length,
          weeklyGoals: weeklyGoals.length,
          fromDate: oneWeekAgo.toISOString() 
        });

        return weeklyGoals.map(goal => this.mapToResponse(goal));
      },
      'Get weekly goals',
      userId
    );
  }

  async getCompletedGoals(userId: number): Promise<GoalResponse[]> {
    return goalLogger.timeOperation(
      'getCompletedGoals',
      async () => {
        await goalLogger.debug('getCompletedGoals', 'Fetching completed goals', { userId });
        
        const allGoals = await this.goalRepository.findByUserId(userId);
        const completedGoals = allGoals.filter(goal => goal.completed);
        
        await goalLogger.info('getCompletedGoals', 'Completed goals retrieved successfully', { 
          userId, 
          totalGoals: allGoals.length,
          completedGoals: completedGoals.length 
        });
        
        return completedGoals.map(goal => this.mapToResponse(goal));
      },
      'Get completed goals',
      userId
    );
  }

  async getPendingGoals(userId: number): Promise<GoalResponse[]> {
    return goalLogger.timeOperation(
      'getPendingGoals',
      async () => {
        await goalLogger.debug('getPendingGoals', 'Fetching pending goals', { userId });
        
        const allGoals = await this.goalRepository.findByUserId(userId);
        const pendingGoals = allGoals.filter(goal => !goal.completed);
        
        await goalLogger.info('getPendingGoals', 'Pending goals retrieved successfully', { 
          userId, 
          totalGoals: allGoals.length,
          pendingGoals: pendingGoals.length 
        });
        
        return pendingGoals.map(goal => this.mapToResponse(goal));
      },
      'Get pending goals',
      userId
    );
  }

  async getGoalStatistics(userId: number): Promise<{
    totalGoals: number;
    completedGoals: number;
    pendingGoals: number;
    completionRate: number;
  }> {
    return goalLogger.timeOperation(
      'getGoalStatistics',
      async () => {
        await goalLogger.debug('getGoalStatistics', 'Calculating goal statistics', { userId });
        
        const totalGoals = await this.goalRepository.getTotalCount(userId);
        const completedGoals = await this.goalRepository.getCompletedCount(userId);
        const pendingGoals = totalGoals - completedGoals;
        const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

        const statistics = {
          totalGoals,
          completedGoals,
          pendingGoals,
          completionRate: Math.round(completionRate * 100) / 100,
        };

        await goalLogger.info('getGoalStatistics', 'Goal statistics calculated successfully', { 
          userId, 
          ...statistics 
        });

        return statistics;
      },
      'Get goal statistics',
      userId
    );
  }

  async getWeeklyStatistics(userId: number): Promise<{
    weeklyGoals: number;
    weeklyCompleted: number;
    weeklyCompletionRate: number;
  }> {
    return goalLogger.timeOperation(
      'getWeeklyStatistics',
      async () => {
        await goalLogger.debug('getWeeklyStatistics', 'Calculating weekly statistics', { userId });
        
        const weeklyGoals = await this.getWeeklyGoals(userId);
        const weeklyCompleted = weeklyGoals.filter(goal => goal.completed).length;
        const weeklyCompletionRate = weeklyGoals.length > 0 
          ? (weeklyCompleted / weeklyGoals.length) * 100 
          : 0;

        const statistics = {
          weeklyGoals: weeklyGoals.length,
          weeklyCompleted,
          weeklyCompletionRate: Math.round(weeklyCompletionRate * 100) / 100,
        };

        await goalLogger.info('getWeeklyStatistics', 'Weekly statistics calculated successfully', { 
          userId, 
          ...statistics 
        });

        return statistics;
      },
      'Get weekly statistics',
      userId
    );
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