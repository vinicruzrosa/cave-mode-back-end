import { UserRepository } from '../repositories/user.repository';
import { User, UpdateSafeModeRequest, SafeModeResponse } from '../types/user';

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async updateSafeMode(userId: number, safeMode: boolean): Promise<SafeModeResponse> {
    const user = await this.userRepository.updateSafeMode(userId, safeMode);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      safeMode: user.safeMode,
      message: user.safeMode 
        ? 'Safe mode activated. Adult content will be filtered.' 
        : 'Safe mode deactivated. Adult content filtering disabled.',
    };
  }

  async getSafeModeStatus(userId: number): Promise<boolean> {
    return this.userRepository.getSafeModeStatus(userId);
  }

  async getUser(userId: number): Promise<User | null> {
    return this.userRepository.findById(userId);
  }

  async isSafeModeEnabled(userId: number): Promise<boolean> {
    return this.userRepository.getSafeModeStatus(userId);
  }
} 