import { BlockedAppRepository } from '../repositories/blockedApp.repository';
import { BlockedApp, CreateBlockedAppRequest, BlockedAppResponse, BlockStatusResponse } from '../types/blockedApp';

export class BlockedAppService {
  private blockedAppRepository: BlockedAppRepository;

  constructor(blockedAppRepository: BlockedAppRepository) {
    this.blockedAppRepository = blockedAppRepository;
  }

  async createBlockedApp(userId: number, data: CreateBlockedAppRequest): Promise<BlockedAppResponse> {
    const blockedApp = await this.blockedAppRepository.create(userId, data);
    return this.mapToResponse(blockedApp);
  }

  async getBlockedApp(userId: number, id: number): Promise<BlockedAppResponse | null> {
    const blockedApp = await this.blockedAppRepository.findById(id, userId);
    return blockedApp ? this.mapToResponse(blockedApp) : null;
  }

  async getUserBlockedApps(userId: number): Promise<BlockedAppResponse[]> {
    const blockedApps = await this.blockedAppRepository.findByUserId(userId);
    return blockedApps.map(app => this.mapToResponse(app));
  }

  async deleteBlockedApp(userId: number, id: number): Promise<boolean> {
    return this.blockedAppRepository.delete(id, userId);
  }

  async checkBlockStatus(userId: number, appName: string): Promise<BlockStatusResponse> {
    return this.blockedAppRepository.checkBlockStatus(userId, appName);
  }

  async isAppBlocked(userId: number, appName: string): Promise<boolean> {
    const status = await this.checkBlockStatus(userId, appName);
    return status.isBlocked;
  }

  async getActiveBlocks(userId: number): Promise<BlockedAppResponse[]> {
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

    return activeBlocks.map(block => this.mapToResponse(block));
  }

  async cleanupExpiredBlocks(): Promise<number> {
    return this.blockedAppRepository.cleanupExpiredBlocks();
  }

  async getBlockStatistics(userId: number): Promise<{
    totalBlocks: number;
    permanentBlocks: number;
    temporaryBlocks: number;
    activeBlocks: number;
  }> {
    const allBlocks = await this.blockedAppRepository.findByUserId(userId);
    const activeBlocks = await this.getActiveBlocks(userId);

    return {
      totalBlocks: allBlocks.length,
      permanentBlocks: allBlocks.filter(block => block.type === 'permanent').length,
      temporaryBlocks: allBlocks.filter(block => block.type === 'temporary').length,
      activeBlocks: activeBlocks.length,
    };
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