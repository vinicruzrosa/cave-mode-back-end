export type BlockType = 'temporary' | 'permanent';

export interface BlockedApp {
  id: number;
  userId: number;
  appName: string;
  type: BlockType;
  duration: number | null; // Duration in minutes for temporary blocks
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBlockedAppRequest {
  appName: string;
  type: BlockType;
  duration?: number; // Required for temporary blocks
}

export interface BlockedAppResponse {
  id: number;
  appName: string;
  type: BlockType;
  duration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlockStatusResponse {
  isBlocked: boolean;
  appName: string;
  type?: BlockType;
  expiresAt?: string; // For temporary blocks
} 