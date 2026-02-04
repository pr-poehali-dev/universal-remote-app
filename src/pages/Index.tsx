import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import RemoteControl from '@/components/RemoteControl';
import DeviceList from '@/components/DeviceList';
import GroupsPanel from '@/components/GroupsPanel';
import HistoryPanel from '@/components/HistoryPanel';
import SettingsPanel from '@/components/SettingsPanel';
import { api, type Device } from '@/lib/api';

const Index = () => {
  const [activeTab, setActiveTab] = useState('remote');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const devicesData = await api.getDevices();
      setDevices(devicesData);
      if (devicesData.length > 0 && !selectedDevice) {
        setSelectedDevice(devicesData[0]);
      }
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Icon name="Radio" className="text-primary" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ИК-Universal</h1>
                <p className="text-xs text-muted-foreground">Управление техникой</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
              <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse-glow" />
              {devices.length} устройств
            </Badge>
          </div>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="container mx-auto px-4 py-6">
          {activeTab === 'remote' && selectedDevice && (
            <Card className="mb-4 p-4 bg-card/50 border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Tv" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">{selectedDevice.name}</h2>
                    <p className="text-sm text-muted-foreground">{selectedDevice.model}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="touch-feedback">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </Card>
          )}

          <TabsContent value="remote" className="mt-0">
            {selectedDevice ? (
              <RemoteControl device={selectedDevice} />
            ) : (
              <Card className="p-8 text-center">
                <Icon name="Radio" size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Выберите устройство</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="devices" className="mt-0">
            <DeviceList 
              devices={devices} 
              onSelectDevice={(device) => {
                setSelectedDevice(device);
                setActiveTab('remote');
              }} 
              onRefresh={loadDevices}
            />
          </TabsContent>

          <TabsContent value="groups" className="mt-0">
            <GroupsPanel />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <HistoryPanel />
          </TabsContent>

          <TabsContent value="settings" className="mt-0">
            <SettingsPanel />
          </TabsContent>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border">
          <TabsList className="w-full h-16 bg-transparent grid grid-cols-5 gap-1 p-2">
            <TabsTrigger
              value="remote"
              className="flex-col gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary touch-feedback"
            >
              <Icon name="Radio" size={20} />
              <span className="text-[10px]">Пульты</span>
            </TabsTrigger>

            <TabsTrigger
              value="devices"
              className="flex-col gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary touch-feedback"
            >
              <Icon name="Tv" size={20} />
              <span className="text-[10px]">Устройства</span>
            </TabsTrigger>

            <TabsTrigger
              value="groups"
              className="flex-col gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary touch-feedback"
            >
              <Icon name="Layers" size={20} />
              <span className="text-[10px]">Группы</span>
            </TabsTrigger>

            <TabsTrigger
              value="history"
              className="flex-col gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary touch-feedback"
            >
              <Icon name="History" size={20} />
              <span className="text-[10px]">История</span>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="flex-col gap-1 data-[state=active]:bg-primary/20 data-[state=active]:text-primary touch-feedback"
            >
              <Icon name="Settings" size={20} />
              <span className="text-[10px]">Настройки</span>
            </TabsTrigger>
          </TabsList>
        </nav>
      </Tabs>
    </div>
  );
};

export default Index;