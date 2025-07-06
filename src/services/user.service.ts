import { UserRepository } from '../repositories/user.repository';
import { User, UpdateSafeModeRequest, SafeModeResponse } from '../types/user';
import { userLogger } from '../utils/logger';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async updateSafeMode(userId: number, safeMode: boolean): Promise<SafeModeResponse> {
    return userLogger.timeOperation(
      'updateSafeMode',
      async () => {
        await userLogger.info('updateSafeMode', 'Attempting to update safe mode', { userId, safeMode });
        
        const user = await this.userRepository.updateSafeMode(userId, safeMode);
        
        if (!user) {
          await userLogger.error('updateSafeMode', 'User not found', null, { userId, safeMode });
          throw new Error('User not found');
        }

        await userLogger.info('updateSafeMode', 'Safe mode updated successfully', { 
          userId, 
          safeMode: user.safeMode,
          previousSafeMode: !safeMode 
        });

        return {
          safeMode: user.safeMode,
          message: user.safeMode 
            ? 'Safe mode activated. Adult content will be filtered.' 
            : 'Safe mode deactivated. Adult content filtering disabled.',
        };
      },
      'Update safe mode for user',
      userId,
      { safeMode }
    );
  }

  async getSafeModeStatus(userId: number): Promise<boolean> {
    return userLogger.timeOperation(
      'getSafeModeStatus',
      async () => {
        await userLogger.debug('getSafeModeStatus', 'Fetching safe mode status', { userId });
        
        const status = await this.userRepository.getSafeModeStatus(userId);
        
        await userLogger.info('getSafeModeStatus', 'Safe mode status retrieved', { userId, status });
        
        return status;
      },
      'Get safe mode status for user',
      userId
    );
  }

  async getUser(userId: number): Promise<User | null> {
    return userLogger.timeOperation(
      'getUser',
      async () => {
        await userLogger.debug('getUser', 'Fetching user data', { userId });
        
        const user = await this.userRepository.findById(userId);
        
        if (user) {
          await userLogger.info('getUser', 'User data retrieved successfully', { 
            userId, 
            hasSafeMode: !!user.safeMode 
          });
        } else {
          await userLogger.warn('getUser', 'User not found', { userId });
        }
        
        return user;
      },
      'Get user data',
      userId
    );
  }

  async isSafeModeEnabled(userId: number): Promise<boolean> {
    return userLogger.timeOperation(
      'isSafeModeEnabled',
      async () => {
        await userLogger.debug('isSafeModeEnabled', 'Checking if safe mode is enabled', { userId });
        
        const isEnabled = await this.userRepository.getSafeModeStatus(userId);
        
        await userLogger.info('isSafeModeEnabled', 'Safe mode check completed', { userId, isEnabled });
        
        return isEnabled;
      },
      'Check if safe mode is enabled for user',
      userId
    );
  }
} 