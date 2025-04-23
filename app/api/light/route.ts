import { SmartHomeController } from '@/controllers/SmartHomeController';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get('deviceId');
  
  if (!deviceId) {
    return NextResponse.json({ success: false, error: 'Device ID is required' }, { status: 400 });
  }
  
  const response = await SmartHomeController.getLightStatus(deviceId);
  return NextResponse.json(response, { status: response.success ? 200 : 400 });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deviceId, isOn } = body;
    
    if (!deviceId) {
      return NextResponse.json({ success: false, error: 'Device ID is required' }, { status: 400 });
    }
    
    if (typeof isOn !== 'boolean') {
      return NextResponse.json({ success: false, error: 'isOn must be a boolean' }, { status: 400 });
    }
    
    const response = await SmartHomeController.setLightOn(deviceId, isOn);
    return NextResponse.json(response, { status: response.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}