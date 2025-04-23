// User Types
export interface UserModel {
  id: string;
  email: string;
  displayName?: string;
  devices: string[]; // Device IDs
  createdAt: Date;
  updatedAt: Date;
}

// Device Types
export interface DeviceModel {
  id: string;
  name: string;
  userId: string;
  type: 'esp8266';
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Smart Home State Types
export interface SmartHomeState {
  doorOpen: boolean;
  lightOn: boolean;
  electricityOn: boolean;
  motionDetected: boolean;
  lastUpdated: Date;
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