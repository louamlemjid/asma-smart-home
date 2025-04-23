import { DeviceModel } from '@/lib/types';
import { db } from '@/lib/firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';

export class Device implements DeviceModel {
  id: string;
  name: string;
  userId: string;
  type: 'esp8266';
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<DeviceModel>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.userId = data.userId || '';
    this.type = 'esp8266';
    this.isOnline = data.isOnline || false;
    this.lastSeen = data.lastSeen || new Date();
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create a new device in Firestore
  static async create(data: Omit<Partial<DeviceModel>, 'id' | 'createdAt' | 'updatedAt'>): Promise<Device> {
    try {
      // Generate device ID
      const devicesRef = collection(db, 'devices');
      const deviceId = doc(devicesRef).id;
      
      const deviceData: Partial<DeviceModel> = {
        id: deviceId,
        name: data.name,
        userId: data.userId,
        type: 'esp8266',
        isOnline: false,
        lastSeen: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await setDoc(doc(db, 'devices', deviceId), {
        ...deviceData,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      // Create device state document
      await setDoc(doc(db, 'deviceStates', deviceId), {
        doorOpen: false,
        lightOn: false,
        electricityOn: false,
        motionDetected: false,
        lastUpdated: serverTimestamp()
      });
      
      return new Device(deviceData);
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  }

  // Get device by ID from Firestore
  static async getById(deviceId: string): Promise<Device | null> {
    try {
      const deviceDoc = await getDoc(doc(db, 'devices', deviceId));
      
      if (deviceDoc.exists()) {
        const deviceData = deviceDoc.data() as DeviceModel;
        return new Device(deviceData);
      }
      
      return null;
    } catch (error) {
      console.error('Error getting device:', error);
      throw error;
    }
  }

  // Get devices by user ID from Firestore
  static async getByUserId(userId: string): Promise<Device[]> {
    try {
      const devicesRef = collection(db, 'devices');
      const q = query(devicesRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const devices: Device[] = [];
      querySnapshot.forEach((doc) => {
        devices.push(new Device(doc.data() as DeviceModel));
      });
      
      return devices;
    } catch (error) {
      console.error('Error getting devices:', error);
      throw error;
    }
  }

  // Update device in Firestore
  async update(data: Partial<DeviceModel>): Promise<Device> {
    try {
      const deviceRef = doc(db, 'devices', this.id);
      
      await updateDoc(deviceRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // Update local object
      Object.assign(this, data);
      this.updatedAt = new Date();
      
      return this;
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  // Update device connection status in Firestore
  async updateDeviceConnection(): Promise<Device> {
    try {
      const deviceRef = doc(db, 'devices', this.id);

      await updateDoc(deviceRef, {
        lastSeen: serverTimestamp(),
        isOnline: true,
      });

      // Update local object
      this.lastSeen = new Date();
      this.isOnline = true;

      return this;
    } catch (error) {
      console.error('Error updating device connection:', error);
      throw error;
    }
  }

  // Update device status (online/offline)
  async updateStatus(isOnline: boolean): Promise<Device> {
    try {
      await this.update({ 
        isOnline, 
        lastSeen: new Date() 
      });
      return this;
    } catch (error) {
      console.error('Error updating device status:', error);
      throw error;
    }
  }

  // Delete device from Firestore
  async delete(): Promise<void> {
    try {
      await deleteDoc(doc(db, 'devices', this.id));
      // Also delete device state
      await deleteDoc(doc(db, 'deviceStates', this.id));
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }
}