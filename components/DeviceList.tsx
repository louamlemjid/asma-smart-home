'use client';

import { useState } from 'react';
import { useSmartHome } from '@/contexts/SmartHomeContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CirclePlus, Edit2, Trash2, Radio } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export function DeviceList() {
  const { devices, selectedDevice, setSelectedDevice, loading, addDevice, updateDevice, deleteDevice } = useSmartHome();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [editingDevice, setEditingDevice] = useState<string | null>(null);

  const handleAddDevice = async () => {
    if (deviceName.trim()) {
      await addDevice(deviceName);
      setDeviceName('');
      setShowAddDialog(false);
    }
  };

  const handleUpdateDevice = async () => {
    if (editingDevice && deviceName.trim()) {
      await updateDevice(editingDevice, { name: deviceName });
      setDeviceName('');
      setEditingDevice(null);
      setShowEditDialog(false);
    }
  };

  const handleDeleteDevice = async () => {
    if (editingDevice) {
      await deleteDevice(editingDevice);
      setEditingDevice(null);
      setShowDeleteDialog(false);
    }
  };

  const handleSelectDevice = (device: any) => {
    setSelectedDevice(device);
  };

  const handleEditClick = (e: React.MouseEvent, device: any) => {
    e.stopPropagation();
    setEditingDevice(device.id);
    setDeviceName(device.name);
    setShowEditDialog(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, device: any) => {
    e.stopPropagation();
    setEditingDevice(device.id);
    setShowDeleteDialog(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-28" />
        </div>
        {[1, 2].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader>
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-40" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-20 mr-2" />
              <Skeleton className="h-8 w-20" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Devices</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm">
              <CirclePlus className="mr-2 h-4 w-4" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Give your new smart home device a name.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  className="col-span-3"
                  placeholder="Living Room Hub"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddDevice}>Add Device</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Device Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
            <DialogDescription>
              Update your device name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateDevice}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Device Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Device</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this device? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDevice}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {devices.length === 0 ? (
        <Card>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <p className="text-center text-muted-foreground mb-4">
              You don't have any devices yet. Add your first device to get started.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <CirclePlus className="mr-2 h-4 w-4" />
              Add Your First Device
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {devices.map((device) => (
            <Card
              key={device.id}
              className={`w-full cursor-pointer transition-all hover:shadow-md ${
                selectedDevice?.id === device.id ? 'border-primary ring-1 ring-primary' : ''
              }`}
              onClick={() => handleSelectDevice(device)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Radio className="h-4 w-4" />
                    {device.name}
                  </CardTitle>
                  <Badge
                    variant={device.isOnline ? 'default' : 'outline'}
                    className={device.isOnline ? 'bg-green-500 hover:bg-green-600' : 'text-red-500'}
                  >
                    {device.isOnline ? 'Online' : 'Offline'}
                  </Badge>
                </div>
                <CardDescription>
                  Last seen: {device.lastSeen instanceof Date 
                    ? device.lastSeen.toLocaleString() 
                    : new Date(device.lastSeen.seconds * 1000).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {selectedDevice?.id === device.id 
                    ? 'Currently selected and monitoring' 
                    : 'Click to select this device'}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => handleEditClick(e, device)}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleDeleteClick(e, device)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}