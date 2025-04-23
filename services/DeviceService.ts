import { Device } from '@/models/Device';
import { SmartHomeState } from '@/models/SmartHomeState';
import { DeviceModel } from '@/lib/types';

export class DeviceService {
  // Create a new device
  static async createDevice(userId: string, name: string): Promise<Device> {
    try {
      return await Device.create({
        userId,
        name,
        type: 'esp8266',
      });
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  }

  // Get a device by ID
  static async getDevice(deviceId: string): Promise<Device | null> {
    try {
      return await Device.getById(deviceId);
    } catch (error) {
      console.error('Error getting device:', error);
      throw error;
    }
  }

  // Get all devices for a user
  static async getUserDevices(userId: string): Promise<Device[]> {
    try {
      return await Device.getByUserId(userId);
    } catch (error) {
      console.error('Error getting user devices:', error);
      throw error;
    }
  }

  // Update a device
  static async updateDevice(deviceId: string, data: Partial<DeviceModel>): Promise<Device | null> {
    try {
      const device = await Device.getById(deviceId);
      if (!device) {
        return null;
      }
      return await device.update(data);
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  // Delete a device
  static async deleteDevice(deviceId: string): Promise<void> {
    try {
      const device = await Device.getById(deviceId);
      if (device) {
        await device.delete();
      }
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }

  // Get device state
  static async getDeviceState(deviceId: string): Promise<SmartHomeState> {
    try {
      const device = await Device.getById(deviceId);
      if (!device) {
        throw new Error('Device not found');
      }
      await device.updateDeviceConnection();
      console.log('Device connection updated: lastSeen and isOnline !');
      const state = new SmartHomeState(deviceId);
      console.log('Getting device state from DeviceService:', state);
      await state.getState();
      return state;
    } catch (error) {
      console.error('Error getting device state:', error);
      throw error;
    }
  }

  // Control device - Door
  static async controlDoor(deviceId: string, isOpen: boolean): Promise<SmartHomeState> {
    try {
      const state = await this.getDeviceState(deviceId);
      const updatedState = await state.setDoorOpen(isOpen);
      return updatedState as SmartHomeState;
    } catch (error) {
      console.error('Error controlling door:', error);
      throw error;
    }
  }

  // Control device - Light
  static async controlLight(deviceId: string, isOn: boolean): Promise<SmartHomeState> {
    try {
      const state = await this.getDeviceState(deviceId);
      return await state.setLightOn(isOn) as SmartHomeState;
    } catch (error) {
      console.error('Error controlling light:', error);
      throw error;
    }
  }

  // Control device - Electricity
  static async controlElectricity(deviceId: string, isOn: boolean): Promise<SmartHomeState> {
    try {
      const state = await this.getDeviceState(deviceId);
      return await state.setElectricityOn(isOn) as SmartHomeState;
    } catch (error) {
      console.error('Error controlling electricity:', error);
      throw error;
    }
  }

  // Report motion
  static async reportMotion(deviceId: string, isDetected: boolean): Promise<SmartHomeState> {
    try {
      const state = await this.getDeviceState(deviceId);
      return await state.setMotionDetected(isDetected) as SmartHomeState;
    } catch (error) {
      console.error('Error reporting motion:', error);
      throw error;
    }
  }
}