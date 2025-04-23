import { Device } from '@/models/Device';
import { DeviceService } from '@/services/DeviceService';
import { DeviceModel, ApiResponse, SmartHomeState } from '@/lib/types';

export class DeviceController {
  // Create a new device
  static async createDevice(userId: string, name: string): Promise<ApiResponse<DeviceModel>> {
    try {
      const device = await DeviceService.createDevice(userId, name);
      
      return {
        success: true,
        data: device
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to create device'
      };
    }
  }

  // Get a device by ID
  static async getDevice(deviceId: string): Promise<ApiResponse<DeviceModel>> {
    try {
      const device = await DeviceService.getDevice(deviceId);
      
      if (!device) {
        return {
          success: false,
          error: 'Device not found'
        };
      }
      
      return {
        success: true,
        data: device
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get device'
      };
    }
  }

  // Update a device
  static async updateDevice(deviceId: string, data: Partial<DeviceModel>): Promise<ApiResponse<DeviceModel>> {
    try {
      const device = await DeviceService.updateDevice(deviceId, data);
      
      if (!device) {
        return {
          success: false,
          error: 'Device not found'
        };
      }
      
      return {
        success: true,
        data: device
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update device'
      };
    }
  }

  // Delete a device
  static async deleteDevice(deviceId: string): Promise<ApiResponse<null>> {
    try {
      await DeviceService.deleteDevice(deviceId);
      
      return {
        success: true
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to delete device'
      };
    }
  }

  // Get device state
  static async getDeviceState(deviceId: string): Promise<ApiResponse<SmartHomeState>> {
    try {
      const state = await DeviceService.getDeviceState(deviceId);
      
      return {
        success: true,
        data: state
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get device state'
      };
    }
  }

  // Control door
  static async controlDoor(deviceId: string, isOpen: boolean): Promise<ApiResponse<SmartHomeState>> {
    try {
      const state = await DeviceService.controlDoor(deviceId, isOpen);
      
      return {
        success: true,
        data: state
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to control door'
      };
    }
  }

  // Control light
  static async controlLight(deviceId: string, isOn: boolean): Promise<ApiResponse<SmartHomeState>> {
    try {
      const state = await DeviceService.controlLight(deviceId, isOn);
      
      return {
        success: true,
        data: state
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to control light'
      };
    }
  }

  // Control electricity
  static async controlElectricity(deviceId: string, isOn: boolean): Promise<ApiResponse<SmartHomeState>> {
    try {
      const state = await DeviceService.controlElectricity(deviceId, isOn);
      
      return {
        success: true,
        data: state
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to control electricity'
      };
    }
  }

  // Report motion
  static async reportMotion(deviceId: string, isDetected: boolean): Promise<ApiResponse<SmartHomeState>> {
    try {
      const state = await DeviceService.reportMotion(deviceId, isDetected);
      
      return {
        success: true,
        data: state
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to report motion'
      };
    }
  }
}