export interface Routine {
  id: number;
  userId: number;
  title: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoutineRequest {
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
}

export interface UpdateRoutineRequest {
  title?: string;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
}

export interface RoutineResponse {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
} 