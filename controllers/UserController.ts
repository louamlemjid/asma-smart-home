import { User } from '@/models/User';
import { Device } from '@/models/Device';
import { LoginCredentials, SignupCredentials, ApiResponse, UserModel } from '@/lib/types';
import { AuthService } from '@/services/AuthService';

export class UserController {
  // Sign up a new user
  static async signup(credentials: SignupCredentials): Promise<ApiResponse<UserModel>> {
    try {
      const user = await AuthService.signup(credentials);
      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign up'
      };
    }
  }

  // Sign in a user
  static async login(credentials: LoginCredentials): Promise<ApiResponse<UserModel>> {
    try {
      const firebaseUser = await AuthService.login(credentials);
      const user = await User.getById(firebaseUser.uid);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to log in'
      };
    }
  }

  // Sign out a user
  static async logout(): Promise<ApiResponse<null>> {
    try {
      await AuthService.logout();
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to log out'
      };
    }
  }

  // Get the current user
  static async getCurrentUser(): Promise<ApiResponse<UserModel>> {
    try {
      const firebaseUser = AuthService.getCurrentUser();
      
      if (!firebaseUser) {
        return {
          success: false,
          error: 'User not authenticated'
        };
      }
      
      const user = await User.getById(firebaseUser.uid);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      return {
        success: true,
        data: user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get current user'
      };
    }
  }

  // Update user profile
  static async updateProfile(userId: string, data: Partial<UserModel>): Promise<ApiResponse<UserModel>> {
    try {
      const user = await User.getById(userId);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }
      
      const updatedUser = await user.update(data);
      
      return {
        success: true,
        data: updatedUser
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  }

  // Get user devices
  static async getUserDevices(userId: string): Promise<ApiResponse<Device[]>> {
    try {
      const devices = await Device.getByUserId(userId);
      
      return {
        success: true,
        data: devices
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get user devices'
      };
    }
  }
}