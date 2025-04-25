// src/contexts/SmartHomeContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { SmartHomeState } from "@/models/SmartHomeState";
import { DeviceModel } from "@/lib/types";
import { DeviceService } from "@/services/DeviceService";
import { SSEService } from "@/services/SSEService";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

interface SmartHomeContextType {
  devices: DeviceModel[];
  selectedDevice: DeviceModel | null;
  deviceState: SmartHomeState | null;
  loading: boolean;
  setSelectedDevice: (device: DeviceModel | null) => void;
  refreshDevices: () => Promise<void>;
  controlDoor: (isOpen: boolean) => Promise<void>;
  controlLight: (isOn: boolean) => Promise<void>;
  controlElectricity: (isOn: boolean) => Promise<void>;
  addDevice: (name: string) => Promise<void>;
  updateDevice: (deviceId: string, data: Partial<DeviceModel>) => Promise<void>;
  deleteDevice: (deviceId: string) => Promise<void>;
}

const SmartHomeContext = createContext<SmartHomeContextType | undefined>(undefined);

export const SmartHomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<DeviceModel[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | null>(null);
  const [deviceState, setDeviceState] = useState<SmartHomeState | null>(null);
  const [loading, setLoading] = useState(false);
  const sseServiceRef = useRef<SSEService | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const { user, userData } = useAuth();

  // Load user devices
  useEffect(() => {
    if (userData) {
      refreshDevices();
    } else {
      setDevices([]);
      setSelectedDevice(null);
      setDeviceState(null);
    }
  }, [userData]);

  // Initialize SSE service when a device is selected
  useEffect(() => {
    if (!selectedDevice) {
      // Cleanup previous SSEService
      if (sseServiceRef.current) {
        console.log('Disconnecting previous SSE for device:', sseServiceRef.current['deviceId']);
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        sseServiceRef.current.disconnect();
        sseServiceRef.current = null;
      }
      return;
    }

    // Create or reuse SSEService
    if (!sseServiceRef.current || sseServiceRef.current['deviceId'] !== selectedDevice.id) {
      // Cleanup previous SSEService
      if (sseServiceRef.current) {
        console.log('Disconnecting previous SSE for device:', sseServiceRef.current['deviceId']);
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        sseServiceRef.current.disconnect();
      }

      // Create new SSEService
      sseServiceRef.current = new SSEService(selectedDevice.id);
      console.log('Created new SSEService for device:', selectedDevice.id);

      // Connect to SSE endpoint
      sseServiceRef.current.connect();
      console.log('SSE connected to device:', selectedDevice.id);

      // Load initial device state
      loadDeviceState(selectedDevice.id);

      // Subscribe to state changes
      unsubscribeRef.current = sseServiceRef.current.subscribeToStateChanges((state) => {
        console.log('State change received for', selectedDevice.id, state);
        setDeviceState(new SmartHomeState(state.deviceId, state)); // Ensure state is a SmartHomeState instance
      });
    }

    return () => {
      // Cleanup on unmount
      if (sseServiceRef.current) {
        console.log('Cleaning up SSE for device:', selectedDevice.id);
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        sseServiceRef.current.disconnect();
        sseServiceRef.current = null;
      }
    };
  }, [selectedDevice?.id]); // Depend on device ID

  // Load device state
  const loadDeviceState = async (deviceId: string) => {
    try {
      console.log("loadDeviceState is called for", deviceId);
      setLoading(true);
      const state = await DeviceService.getDeviceState(deviceId);
      console.log('Loaded initial state for', deviceId, state);
      setDeviceState(new SmartHomeState(state.deviceId, state)); // Ensure state is a SmartHomeState instance
    } catch (error) {
      console.error('Error loading device state:', error);
      toast.error('Failed to load device state');
    } finally {
      setLoading(false);
    }
  };

  // Refresh devices
  const refreshDevices = async () => {
    try {
      console.log("refreshDevices is called");
      if (!userData) return;

      setLoading(true);
      const userDevices = await DeviceService.getUserDevices(userData.id);
      setDevices(userDevices);

      // Select first device if none selected or reselect current device
      if (userDevices.length > 0) {
        if (!selectedDevice || !userDevices.find((d) => d.id === selectedDevice.id)) {
          setSelectedDevice(userDevices[0]);
        } else {
          // Update selectedDevice to latest data
          const updatedDevice = userDevices.find((d) => d.id === selectedDevice.id);
          if (updatedDevice) {
            setSelectedDevice({ ...updatedDevice });
          }
        }
      }
    } catch (error) {
      console.error('Error loading devices:', error);
      toast.error('Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  // Add device
  const addDevice = async (name: string) => {
    try {
      if (!userData) {
        toast.error('You must be logged in to add a device');
        return;
      }

      setLoading(true);
      await DeviceService.createDevice(userData.id, name);
      await refreshDevices();
      toast.success('Device added successfully');
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
    } finally {
      setLoading(false);
    }
  };

  // Update device
  const updateDevice = async (deviceId: string, data: Partial<DeviceModel>) => {
    try {
      setLoading(true);
      await DeviceService.updateDevice(deviceId, data);
      await refreshDevices();
      toast.success('Device updated successfully');
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Failed to update device');
    } finally {
      setLoading(false);
    }
  };

  // Delete device
  const deleteDevice = async (deviceId: string) => {
    try {
      setLoading(true);
      await DeviceService.deleteDevice(deviceId);

      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(null);
        setDeviceState(null);
      }

      await refreshDevices();
      toast.success('Device deleted successfully');
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
    } finally {
      setLoading(false);
    }
  };

  // Control door
  const controlDoor = async (isOpen: boolean) => {
    try {
      if (!selectedDevice) {
        toast.error('No device selected');
        return;
      }

      setLoading(true);
      const state = await DeviceService.controlDoor(selectedDevice.id, isOpen);
      setDeviceState(new SmartHomeState(state.deviceId, state)); // Ensure state is a SmartHomeState instance
      toast.success(`Door ${isOpen ? 'opened' : 'closed'} successfully`);
    } catch (error) {
      console.error('Error controlling door:', error);
      toast.error('Failed to control door');
    } finally {
      setLoading(false);
    }
  };

  // Control light
  const controlLight = async (isOn: boolean) => {
    try {
      if (!selectedDevice) {
        toast.error('No device selected');
        return;
      }

      setLoading(true);
      const state = await DeviceService.controlLight(selectedDevice.id, isOn);
      setDeviceState(new SmartHomeState(state.deviceId, state)); // Ensure state is a SmartHomeState instance
      toast.success(`Light turned ${isOn ? 'on' : 'off'} successfully`);
    } catch (error) {
      console.error('Error controlling light:', error);
      toast.error('Failed to control light');
    } finally {
      setLoading(false);
    }
  };

  // Control electricity
  const controlElectricity = async (isOn: boolean) => {
    try {
      if (!selectedDevice) {
        toast.error('No device selected');
        return;
      }

      setLoading(true);
      const state = await DeviceService.controlElectricity(selectedDevice.id, isOn);
      setDeviceState(new SmartHomeState(state.deviceId, state)); // Ensure state is a SmartHomeState instance
      toast.success(`Electricity ${isOn ? 'restored' : 'cut'} successfully`);
    } catch (error) {
      console.error('Error controlling electricity:', error);
      toast.error('Failed to control electricity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SmartHomeContext.Provider
      value={{
        devices,
        selectedDevice,
        deviceState,
        loading,
        setSelectedDevice,
        refreshDevices,
        controlDoor,
        controlLight,
        controlElectricity,
        addDevice,
        updateDevice,
        deleteDevice,
      }}
    >
      {children}
    </SmartHomeContext.Provider>
  );
};

export const useSmartHome = () => {
  const context = useContext(SmartHomeContext);
  if (context === undefined) {
    throw new Error('useSmartHome must be used within a SmartHomeProvider');
  }
  return context;
};