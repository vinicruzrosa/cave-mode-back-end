export type AlarmRepeat = 'once' | 'daily' | 'weekly';

export interface CreateAlarmRequest {
  time: string; // ISO string
  repeat: AlarmRepeat;
}

export interface UpdateAlarmRequest {
  time?: string;
  repeat?: AlarmRepeat;
  active?: boolean;
}

export interface AlarmResponse {
  id: number;
  userId: number;
  time: string;
  active: boolean;
  repeat: AlarmRepeat;
  createdAt: string;
  updatedAt: string;
}

export interface SelfieResponse {
  id: number;
  alarmId: number;
  imagePath: string;
  brightness: number;
  approved: boolean;
  createdAt: string;
}

export interface LightVerificationResult {
  brightness: number;
  approved: boolean;
  message: string;
} 