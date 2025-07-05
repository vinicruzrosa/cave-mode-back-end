export interface Goal {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateGoalRequest {
  title: string;
}

export interface UpdateGoalRequest {
  title?: string;
  completed?: boolean;
}

export interface GoalResponse {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
} 