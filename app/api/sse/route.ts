import { SmartHomeState } from '@/models/SmartHomeState';
import { DeviceService } from '@/services/DeviceService';
import { NextRequest } from 'next/server';

const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('deviceId');
  
  if (!deviceId) {
    return new Response('Device ID is required', { status: 400 });
  }
  
  // Verify the device exists
  const device = await DeviceService.getDevice(deviceId);
  if (!device) {
    return new Response('Device not found', { status: 404 });
  }
  
  // Set up SSE headers
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };
  
  // Create new ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial state
      const initialState = await DeviceService.getDeviceState(deviceId);
      sendState(controller, initialState);
      
      // Set up Firestore listener for state changes
      const smartHomeState = new SmartHomeState(deviceId);
      const unsubscribe = smartHomeState.subscribeToChanges('sse', (state) => {
        sendState(controller, state);
      });
      
      // Clean up function
      request.signal.addEventListener('abort', () => {
        unsubscribe();
      });
    },
  });
  
  // Helper function to send state updates
  function sendState(controller: ReadableStreamDefaultController, state: SmartHomeState) {
    try {
      // Send general message
      controller.enqueue(`data: ${JSON.stringify({
        type: 'state',
        data: {
          doorOpen: state.doorOpen,
          lightOn: state.lightOn,
          electricityOn: state.electricityOn,
          motionDetected: state.motionDetected,
          lastUpdated: state.lastUpdated
        },
        timestamp: Date.now()
      })}\n\n`);
      
      // Send specific events
      controller.enqueue(`event: doorStatus\ndata: ${JSON.stringify({ isOpen: state.doorOpen })}\n\n`);
      controller.enqueue(`event: lightStatus\ndata: ${JSON.stringify({ isOn: state.lightOn })}\n\n`);
      controller.enqueue(`event: electricityStatus\ndata: ${JSON.stringify({ isOn: state.electricityOn })}\n\n`);
      controller.enqueue(`event: motionStatus\ndata: ${JSON.stringify({ isDetected: state.motionDetected })}\n\n`);
    } catch (error) {
      console.error('Error sending state:', error);
    }
  }
  
  return new Response(stream, { headers });
}