import { BlockedAppRepository } from '../repositories/blockedApp.repository';
import { BlockedApp, CreateBlockedAppRequest, BlockedAppResponse, BlockStatusResponse } from '../types/blockedApp';
import { blockedAppLogger } from '../utils/logger';

export class BlockedAppService {
  private blockedAppRepository: BlockedAppRepository;

  constructor(blockedAppRepository: BlockedAppRepository) {
    this.blockedAppRepository = blockedAppRepository;
  }

  async createBlockedApp(userId: number, data: CreateBlockedAppRequest): Promise<BlockedAppResponse> {
    return blockedAppLogger.timeOperation(
      'createBlockedApp',
      async () => {
        await blockedAppLogger.info('createBlockedApp', 'Creating new blocked app', { userId, appData: data });
        
        const blockedApp = await this.blockedAppRepository.create(userId, data);
        
        await blockedAppLogger.info('createBlockedApp', 'Blocked app created successfully', { 
          userId, 
          appId: blockedApp.id, 
          appName: blockedApp.appName,
          type: blockedApp.type,
          duration: blockedApp.duration 
        });
        
        return this.mapToResponse(blockedApp);
      },
      'Create new blocked app',
      userId,
      data
    );
  }

  async getBlockedApp(userId: number, id: number): Promise<BlockedAppResponse | null> {
    return blockedAppLogger.timeOperation(
      'getBlockedApp',
      async () => {
        await blockedAppLogger.debug('getBlockedApp', 'Fetching blocked app by ID', { userId, appId: id });
        
        const blockedApp = await this.blockedAppRepository.findById(id, userId);
        
        if (blockedApp) {
          await blockedAppLogger.info('getBlockedApp', 'Blocked app retrieved successfully', { 
            userId, 
            appId: id, 
            appName: blockedApp.appName,
            type: blockedApp.type 
          });
        } else {
          await blockedAppLogger.warn('getBlockedApp', 'Blocked app not found', { userId, appId: id });
        }
        
        return blockedApp ? this.mapToResponse(blockedApp) : null;
      },
      'Get blocked app by ID',
      userId,
      { appId: id }
    );
  }

  async getUserBlockedApps(userId: number): Promise<BlockedAppResponse[]> {
    return blockedAppLogger.timeOperation(
      'getUserBlockedApps',
      async () => {
        await blockedAppLogger.debug('getUserBlockedApps', 'Fetching all blocked apps for user', { userId });
        
        const blockedApps = await this.blockedAppRepository.findByUserId(userId);
        
        await blockedAppLogger.info('getUserBlockedApps', 'User blocked apps retrieved successfully', { 
          userId, 
          count: blockedApps.length,
          permanentCount: blockedApps.filter(app => app.type === 'permanent').length,
          temporaryCount: blockedApps.filter(app => app.type === 'temporary').length 
        });
        
        return blockedApps.map(app => this.mapToResponse(app));
      },
      'Get all blocked apps for user',
      userId
    );
  }

  async deleteBlockedApp(userId: number, id: number): Promise<boolean> {
    return blockedAppLogger.timeOperation(
      'deleteBlockedApp',
      async () => {
        await blockedAppLogger.info('deleteBlockedApp', 'Deleting blocked app', { userId, appId: id });
        
        const success = await this.blockedAppRepository.delete(id, userId);
        
        if (success) {
          await blockedAppLogger.info('deleteBlockedApp', 'Blocked app deleted successfully', { userId, appId: id });
        } else {
          await blockedAppLogger.error('deleteBlockedApp', 'Failed to delete blocked app or app not found', null, { 
            userId, 
            appId: id 
          });
        }
        
        return success;
      },
      'Delete blocked app',
      userId,
      { appId: id }
    );
  }

  async checkBlockStatus(userId: number, appName: string): Promise<BlockStatusResponse> {
    return blockedAppLogger.timeOperation(
      'checkBlockStatus',
      async () => {
        await blockedAppLogger.debug('checkBlockStatus', 'Checking block status for app', { userId, appName });
        
        const status = await this.blockedAppRepository.checkBlockStatus(userId, appName);
        
        await blockedAppLogger.info('checkBlockStatus', 'Block status checked successfully', { 
          userId, 
          appName, 
          isBlocked: status.isBlocked,
          type: status.type,
          expiresAt: status.expiresAt 
        });
        
        return status;
      },
      'Check block status for app',
      userId,
      { appName }
    );
  }

  async isAppBlocked(userId: number, appName: string): Promise<boolean> {
    return blockedAppLogger.timeOperation(
      'isAppBlocked',
      async () => {
        await blockedAppLogger.debug('isAppBlocked', 'Checking if app is blocked', { userId, appName });
        
        const status = await this.checkBlockStatus(userId, appName);
        const isBlocked = status.isBlocked;
        
        await blockedAppLogger.info('isAppBlocked', 'App block check completed', { 
          userId, 
          appName, 
          isBlocked 
        });
        
        return isBlocked;
      },
      'Check if app is blocked',
      userId,
      { appName }
    );
  }

  async getActiveBlocks(userId: number): Promise<BlockedAppResponse[]> {
    return blockedAppLogger.timeOperation(
      'getActiveBlocks',
      async () => {
        await blockedAppLogger.debug('getActiveBlocks', 'Fetching active blocks for user', { userId });
        
        const allBlocks = await this.blockedAppRepository.findByUserId(userId);
        const activeBlocks: BlockedApp[] = [];

        for (const block of allBlocks) {
          if (block.type === 'permanent') {
            activeBlocks.push(block);
          } else if (block.type === 'temporary' && block.duration) {
            const expiresAt = new Date(block.createdAt.getTime() + block.duration * 60 * 1000);
            if (new Date() < expiresAt) {
              activeBlocks.push(block);
            }
          }
        }

        await blockedAppLogger.info('getActiveBlocks', 'Active blocks retrieved successfully', { 
          userId, 
          totalBlocks: allBlocks.length,
          activeBlocks: activeBlocks.length,
          permanentBlocks: activeBlocks.filter(b => b.type === 'permanent').length,
          temporaryBlocks: activeBlocks.filter(b => b.type === 'temporary').length 
        });

        return activeBlocks.map(block => this.mapToResponse(block));
      },
      'Get active blocks for user',
      userId
    );
  }

  async cleanupExpiredBlocks(): Promise<number> {
    return blockedAppLogger.timeOperation(
      'cleanupExpiredBlocks',
      async () => {
        await blockedAppLogger.info('cleanupExpiredBlocks', 'Starting cleanup of expired blocks');
        
        const cleanedCount = await this.blockedAppRepository.cleanupExpiredBlocks();
        
        await blockedAppLogger.info('cleanupExpiredBlocks', 'Cleanup completed successfully', { 
          cleanedCount 
        });
        
        return cleanedCount;
      },
      'Cleanup expired blocks'
    );
  }

  async getBlockStatistics(userId: number): Promise<{
    totalBlocks: number;
    permanentBlocks: number;
    temporaryBlocks: number;
    activeBlocks: number;
  }> {
    return blockedAppLogger.timeOperation(
      'getBlockStatistics',
      async () => {
        await blockedAppLogger.debug('getBlockStatistics', 'Calculating block statistics', { userId });
        
        const allBlocks = await this.blockedAppRepository.findByUserId(userId);
        const activeBlocks = await this.getActiveBlocks(userId);

        const statistics = {
          totalBlocks: allBlocks.length,
          permanentBlocks: allBlocks.filter(block => block.type === 'permanent').length,
          temporaryBlocks: allBlocks.filter(block => block.type === 'temporary').length,
          activeBlocks: activeBlocks.length,
        };

        await blockedAppLogger.info('getBlockStatistics', 'Block statistics calculated successfully', { 
          userId, 
          ...statistics 
        });

        return statistics;
      },
      'Get block statistics',
      userId
    );
  }

  private mapToResponse(blockedApp: BlockedApp): BlockedAppResponse {
    return {
      id: blockedApp.id,
      appName: blockedApp.appName,
      type: blockedApp.type,
      duration: blockedApp.duration || undefined,
      createdAt: blockedApp.createdAt.toISOString(),
      updatedAt: blockedApp.updatedAt.toISOString(),
    };
  }
} 