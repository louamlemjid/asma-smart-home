'use client';

import { useEffect, useState } from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle, DoorOpen, Lightbulb, Zap, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export function DeviceControls() {
  const { deviceState, loading, controlDoor, controlLight, controlElectricity } = useSmartHome();
  const [isLoading, setIsLoading] = useState({
    door: false,
    light: false,
    electricity: false,
  });
  useEffect(()=>{
    console.log("devicestate from the device control use effect: ",deviceState)
  },[deviceState])
  console.log("devicestate from the device control: ",deviceState)
  const handleDoorToggle = async (checked: boolean) => {
    setIsLoading((prev) => ({ ...prev, door: true }));
    await controlDoor(checked);
    setIsLoading((prev) => ({ ...prev, door: false }));
  };

  const handleLightToggle = async (checked: boolean) => {
    setIsLoading((prev) => ({ ...prev, light: true }));
    await controlLight(checked);
    setIsLoading((prev) => ({ ...prev, light: false }));
  };

  const handleElectricityToggle = async (checked: boolean) => {
    setIsLoading((prev) => ({ ...prev, electricity: true }));
    await controlElectricity(checked);
    setIsLoading((prev) => ({ ...prev, electricity: false }));
  };

  if (loading || !deviceState) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full rounded-md" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Door Control Card */}
      <Card className="w-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <DoorOpen className="h-5 w-5" />
              Door
            </CardTitle>
            <Badge
              variant={deviceState.doorOpen ? 'default' : 'outline'}
              className={deviceState.doorOpen ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {deviceState.doorOpen ? 'Open' : 'Closed'}
            </Badge>
          </div>
          <CardDescription>Control your door lock remotely</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-3">
            <Label htmlFor="door-toggle" className="text-base">
              {deviceState.doorOpen ? 'Lock Door' : 'Unlock Door'}
            </Label>
            <Switch
              id="door-toggle"
              checked={deviceState.doorOpen}
              onCheckedChange={handleDoorToggle}
              disabled={isLoading.door}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            variant={deviceState.doorOpen ? 'destructive' : 'default'}
            size="sm"
            className="w-full"
            onClick={() => handleDoorToggle(!deviceState.doorOpen)}
            disabled={isLoading.door}
          >
            {isLoading.door ? (
              'Updating...'
            ) : deviceState.doorOpen ? (
              'Close Door'
            ) : (
              'Open Door'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Light Control Card */}
      <Card className="w-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Light
            </CardTitle>
            <Badge
              variant={deviceState.lightOn ? 'default' : 'outline'}
              className={deviceState.lightOn ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
            >
              {deviceState.lightOn ? 'On' : 'Off'}
            </Badge>
          </div>
          <CardDescription>Control your smart lights</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-3">
            <Label htmlFor="light-toggle" className="text-base">
              {deviceState.lightOn ? 'Turn Off' : 'Turn On'}
            </Label>
            <Switch
              id="light-toggle"
              checked={deviceState.lightOn}
              onCheckedChange={handleLightToggle}
              disabled={isLoading.light}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            variant={deviceState.lightOn ? 'outline' : 'default'}
            size="sm"
            className="w-full"
            onClick={() => handleLightToggle(!deviceState.lightOn)}
            disabled={isLoading.light}
          >
            {isLoading.light ? (
              'Updating...'
            ) : deviceState.lightOn ? (
              'Turn Off Light'
            ) : (
              'Turn On Light'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Electricity Control Card */}
      <Card className="w-full transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Electricity
            </CardTitle>
            <Badge
              variant={deviceState.electricityOn ? 'default' : 'outline'}
              className={deviceState.electricityOn ? 'bg-blue-500 hover:bg-blue-600' : ''}
            >
              {deviceState.electricityOn ? 'On' : 'Off'}
            </Badge>
          </div>
          <CardDescription>Control your home's main power</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <div className="flex items-center space-x-3">
            <Label htmlFor="electricity-toggle" className="text-base">
              {deviceState.electricityOn ? 'Cut Power' : 'Restore Power'}
            </Label>
            <Switch
              id="electricity-toggle"
              checked={deviceState.electricityOn}
              onCheckedChange={handleElectricityToggle}
              disabled={isLoading.electricity}
            />
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            variant={deviceState.electricityOn ? 'outline' : 'default'}
            size="sm"
            className="w-full"
            onClick={() => handleElectricityToggle(!deviceState.electricityOn)}
            disabled={isLoading.electricity}
          >
            {isLoading.electricity ? (
              'Updating...'
            ) : deviceState.electricityOn ? (
              'Cut Electricity'
            ) : (
              'Restore Electricity'
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Motion Monitor Card */}
      <Card className="w-full col-span-1 md:col-span-2 lg:col-span-3 transition-all hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Motion Detector
            </CardTitle>
            <Badge
              variant={deviceState.motionDetected ? 'default' : 'outline'}
              className={deviceState.motionDetected ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              {deviceState.motionDetected ? 'Motion Detected' : 'No Motion'}
            </Badge>
          </div>
          <CardDescription>Monitors motion in your home</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            {deviceState.motionDetected ? (
              <div className="flex items-center gap-2 text-red-500 animate-pulse">
                <AlertCircle className="h-6 w-6" />
                <span className="text-lg font-medium">Motion detected! Check your cameras.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <Activity className="h-6 w-6" />
                <span className="text-lg font-medium">All clear. No motion detected.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}