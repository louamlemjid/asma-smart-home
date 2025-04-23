import { SmartHomeState } from '@/models/SmartHomeState';
import { SSEMessage } from '@/lib/types';

export class SSEService {
  private deviceId: string;
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3 seconds
  private listeners: Map<string, (state: any) => void> = new Map();
  
  constructor(deviceId: string) {
    this.deviceId = deviceId;
  }
  
  // Connect to SSE endpoint
  connect(): void {
    if (typeof window === 'undefined') {
      return; // SSE is client-side only
    }
    
    if (this.eventSource) {
      this.disconnect();
    }
    
    try {
      this.eventSource = new EventSource(`/api/sse?deviceId=${this.deviceId}`);
      
      this.eventSource.onopen = () => {
        console.log('SSE connection established');
        this.reconnectAttempts = 0;
      };
      
      this.eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        this.reconnect();
      };
      
      this.eventSource.onmessage = (event) => {
        try {
          console.log('SSE message received:', event.data);
          const message = JSON.parse(event.data) as SSEMessage;
          this.handleMessage(message);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      // Setup specific event listeners
      this.eventSource.addEventListener('doorStatus', this.handleDoorStatus.bind(this));
      this.eventSource.addEventListener('lightStatus', this.handleLightStatus.bind(this));
      this.eventSource.addEventListener('electricityStatus', this.handleElectricityStatus.bind(this));
      this.eventSource.addEventListener('motionStatus', this.handleMotionStatus.bind(this));
      
    } catch (error) {
      console.error('Error connecting to SSE:', error);
      this.reconnect();
    }
  }
  
  // Reconnect to SSE endpoint with backoff
  private reconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnect attempts reached, giving up');
      return;
    }
    
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  // Disconnect from SSE endpoint
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('SSE connection closed');
    }
  }
  
  // Handle incoming SSE messages
  private handleMessage(message: SSEMessage): void {
    console.log('Handling SSE message:', message);
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      console.log(`Notifying ${message.type} listeners with data:`, message.data);
      listeners(message.data);
    }
    
    // Notify all listeners
    const allListeners = this.listeners.get('all');
    if (allListeners) {
      console.log('Notifying all listeners with message:', message);
      allListeners(message);
    }
  }
  
  private handleDoorStatus(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('Door status event:', data);
      const listeners = this.listeners.get('doorStatus');
      if (listeners) {
        listeners(data);
      }
    } catch (error) {
      console.error('Error handling door status:', error);
    }
  }

  private handleLightStatus(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('Light status event:', data);
      const listeners = this.listeners.get('lightStatus');
      if (listeners) {
        listeners(data);
      }
    } catch (error) {
      console.error('Error handling light status:', error);
    }
  }

  private handleElectricityStatus(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('Electricity status event:', data);
      const listeners = this.listeners.get('electricityStatus');
      if (listeners) {
        listeners(data);
      }
    } catch (error) {
      console.error('Error handling electricity status:', error);
    }
  }

  private handleMotionStatus(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log('Motion status event:', data);
      const listeners = this.listeners.get('motionStatus');
      if (listeners) {
        listeners(data);
      }
    } catch (error) {
      console.error('Error handling motion status:', error);
    }
  }

  subscribeToStateChanges(callback: (state: SmartHomeState) => void): () => void {
    const state = new SmartHomeState(this.deviceId);
    const unsubscribe = state.subscribeToChanges('sse-service', (newState) => {
      console.log('State change for device:', this.deviceId, newState);
      callback(newState);
    });
    return unsubscribe;
  }

  addEventListener(event: string, callback: (data: any) => void): void {
    console.log(`Adding listener for event: ${event}`);
    this.listeners.set(event, callback);
  }

  removeEventListener(event: string): void {
    console.log(`Removing listener for event: ${event}`);
    this.listeners.delete(event);
  }
}