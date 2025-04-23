import { DeviceController } from './DeviceController';
import { ApiResponse, SmartHomeState } from '@/lib/types';

export class SmartHomeController {
  // Door operations
  static async getDoorStatus(deviceId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await DeviceController.getDeviceState(deviceId);
      console.log('Door status response from SmartHomeController:', response);
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to get door status'
        };
      }
      
      return {
        success: true,
        data: response.data.doorOpen
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get door status'
      };
    }
  }

  static async setDoorOpen(deviceId: string, isOpen: boolean): Promise<ApiResponse<SmartHomeState>> {
    return DeviceController.controlDoor(deviceId, isOpen);
  }

  // Light operations
  static async getLightStatus(deviceId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await DeviceController.getDeviceState(deviceId);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to get light status'
        };
      }
      
      return {
        success: true,
        data: response.data.lightOn
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get light status'
      };
    }
  }

  static async setLightOn(deviceId: string, isOn: boolean): Promise<ApiResponse<SmartHomeState>> {
    return DeviceController.controlLight(deviceId, isOn);
  }

  // Electricity operations
  static async getElectricityStatus(deviceId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await DeviceController.getDeviceState(deviceId);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to get electricity status'
        };
      }
      
      return {
        success: true,
        data: response.data.electricityOn
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get electricity status'
      };
    }
  }

  static async setElectricityOn(deviceId: string, isOn: boolean): Promise<ApiResponse<SmartHomeState>> {
    return DeviceController.controlElectricity(deviceId, isOn);
  }

  // Motion operations
  static async getMotionStatus(deviceId: string): Promise<ApiResponse<boolean>> {
    try {
      const response = await DeviceController.getDeviceState(deviceId);
      
      if (!response.success || !response.data) {
        return {
          success: false,
          error: response.error || 'Failed to get motion status'
        };
      }
      
      return {
        success: true,
        data: response.data.motionDetected
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to get motion status'
      };
    }
  }

  static async setMotionDetected(deviceId: string, isDetected: boolean): Promise<ApiResponse<SmartHomeState>> {
    return DeviceController.reportMotion(deviceId, isDetected);
  }

  // Get full device state
  static async getFullState(deviceId: string): Promise<ApiResponse<SmartHomeState>> {
    return DeviceController.getDeviceState(deviceId);
  }
}