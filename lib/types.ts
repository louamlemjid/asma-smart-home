import { Timestamp } from 'firebase/firestore';
// User Types
export interface UserModel {
  id: string;
  email: string;
  displayName?: string;
  devices: string[]; // Device IDs
  createdAt: Date|Timestamp;
  updatedAt: Date|Timestamp;
}

// Device Types
export interface DeviceModel {
  id: string;
  name: string;
  userId: string;
  type: 'esp8266';
  isOnline: boolean;
  lastSeen: Date|Timestamp;
  createdAt: Date|Timestamp;
  updatedAt: Date|Timestamp;
}

// Smart Home State Types
export interface SmartHomeState {
  doorOpen: boolean;
  lightOn: boolean;
  electricityOn: boolean;
  motionDetected: boolean;
  lastUpdated: Date;
  deviceId: string;
  listeners: Map<string, (state: SmartHomeState) => void>;
  getState(): Promise<SmartHomeState>
  updateState(data: Partial<SmartHomeState>): Promise<SmartHomeState> 
  subscribeToChanges(listenerId: string, callback: (state: SmartHomeState) => void): () => void;
  unsubscribeFromChanges(listenerId: string): void;
  setDoorOpen(doorOpen: boolean): Promise<SmartHomeState>;
  setLightOn(lightOn: boolean): Promise<SmartHomeState>;
  setElectricityOn(electricityOn: boolean): Promise<SmartHomeState>;
  setMotionDetected(motionDetected: boolean): Promise<SmartHomeState>;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName?: string;
}

// SSE Types
export interface SSEMessage {
  type: string;
  data: any;
  timestamp: number;
}