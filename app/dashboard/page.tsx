'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { DeviceList } from '@/components/DeviceList';
import { DeviceControls } from '@/components/DeviceControls';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { devices, selectedDevice, loading: deviceLoading } = useSmartHome();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <p className="text-center py-12">Loading...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // This will be redirected by the useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Smart Home Dashboard</h1>

        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls">
            {selectedDevice ? (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Device Control Panel</CardTitle>
                    <CardDescription>
                      Controlling: {selectedDevice.name} {' '}
                      <span className={selectedDevice.isOnline ? 'text-green-500' : 'text-red-500'}>
                        ({selectedDevice.isOnline ? 'Online' : 'Offline'})
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DeviceControls />
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-6 flex flex-col items-center justify-center py-12">
                  <p className="text-center text-muted-foreground mb-4">
                    {devices.length === 0 
                      ? "You don't have any devices yet. Add your first device to get started."
                      : "Select a device from the Devices tab to control it."}
                  </p>
                  <Button onClick={() => document.querySelector('[value="devices"]')?.dispatchEvent(new MouseEvent('click'))}>
                    {devices.length === 0 ? (
                      <>
                        <CirclePlus className="mr-2 h-4 w-4" />
                        Add Your First Device
                      </>
                    ) : (
                      'Go to Devices'
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>
                  Manage your connected smart home devices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}