import { DeviceController } from '@/controllers/DeviceController';
import { SmartHomeController } from '@/controllers/SmartHomeController';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('deviceId');
  
  if (!deviceId) {
    return NextResponse.json({ success: false, error: 'Device ID is required' }, { status: 400 });
  }
  
  const response = await SmartHomeController.getDoorStatus(deviceId);
  console.log('Door status response:', response);
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, isOpen } = body;
    
    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'Device ID is required' }, { status: 400 });
    }
    
    if (typeof isOpen !== 'boolean') {
      return NextResponse.json({ success: false, error: 'isOpen must be a boolean' }, { status: 400 });
    }
    
    const response = await SmartHomeController.setDoorOpen(deviceId, isOpen);
    return NextResponse.json(response, { status: response.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}