import { SmartHomeState as SmartHomeStateType } from '@/lib/types';
import { db } from '@/lib/firebase';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';

export class SmartHomeState implements SmartHomeStateType {
  deviceId: string;
  doorOpen: boolean;
  lightOn: boolean;
  electricityOn: boolean;
  motionDetected: boolean;
  lastUpdated: Date;
  private listeners: Map<string, (state: SmartHomeStateType) => void> = new Map();

  constructor(deviceId: string, data: Partial<SmartHomeStateType> = {}) {
    this.deviceId = deviceId;
    this.doorOpen = data.doorOpen || false;
    this.lightOn = data.lightOn || false;
    this.electricityOn = data.electricityOn || false;
    this.motionDetected = data.motionDetected || false;
    this.lastUpdated = data.lastUpdated || new Date();
  }

  // Get current state from Firestore
  async getState(): Promise<SmartHomeStateType> {
    try {
      const stateDoc = await getDoc(doc(db, 'deviceStates', this.deviceId));
      
      if (stateDoc.exists()) {
        const stateData = stateDoc.data() as SmartHomeStateType;
        this.doorOpen = stateData.doorOpen;
        this.lightOn = stateData.lightOn;
        this.electricityOn = stateData.electricityOn;
        this.motionDetected = stateData.motionDetected;
        this.lastUpdated = stateData.lastUpdated;
      }
      
      return this;
    } catch (error) {
      console.error('Error getting state:', error);
      throw error;
    }
  }

  // Update state in Firestore
  async updateState(data: Partial<SmartHomeStateType>): Promise<SmartHomeStateType> {
    try {
      const stateRef = doc(db, 'deviceStates', this.deviceId);
      
      await updateDoc(stateRef, {
        ...data,
        lastUpdated: serverTimestamp()
      });
      
      // Update local object
      Object.assign(this, data);
      this.lastUpdated = new Date();
      
      return this;
    } catch (error) {
      console.error('Error updating state:', error);
      throw error;
    }
  }

  // Toggle door state
  async setDoorOpen(isOpen: boolean): Promise<SmartHomeStateType> {
    return this.updateState({ doorOpen: isOpen });
  }

  // Toggle light state
  async setLightOn(isOn: boolean): Promise<SmartHomeStateType> {
    return this.updateState({ lightOn: isOn });
  }

  // Toggle electricity state
  async setElectricityOn(isOn: boolean): Promise<SmartHomeStateType> {
    return this.updateState({ electricityOn: isOn });
  }

  // Update motion state
  async setMotionDetected(isDetected: boolean): Promise<SmartHomeStateType> {
    return this.updateState({ motionDetected: isDetected });
  }

  // Subscribe to state changes
  subscribeToChanges(listenerId: string, callback: (state: SmartHomeStateType) => void): Unsubscribe {
    this.listeners.set(listenerId, callback);
    
    const unsubscribe = onSnapshot(
      doc(db, 'deviceStates', this.deviceId),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SmartHomeStateType;
          // Update local state
          this.doorOpen = data.doorOpen;
          this.lightOn = data.lightOn;
          this.electricityOn = data.electricityOn;
          this.motionDetected = data.motionDetected;
          this.lastUpdated = data.lastUpdated;
          
          // Notify listener
          callback(this);
        }
      },
      (error) => {
        console.error('Error subscribing to state changes:', error);
      }
    );
    
    return unsubscribe;
  }

  // Unsubscribe from state changes
  unsubscribeFromChanges(listenerId: string): void {
    this.listeners.delete(listenerId);
  }
}