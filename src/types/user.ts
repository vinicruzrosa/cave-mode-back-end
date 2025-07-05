export interface User {
  id: number;
  email: string;
  password: string;
  safeMode: boolean;
  createdAt: Date;
}

export interface UpdateSafeModeRequest {
  safeMode: boolean;
}

export interface SafeModeResponse {
  safeMode: boolean;
  message: string;
} 