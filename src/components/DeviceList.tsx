import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { type Device } from '@/lib/api';

interface DeviceListProps {
  devices: Device[];
  onSelectDevice: (device: Device) => void;
  onRefresh: () => void;
}

const DeviceList = ({ devices, onSelectDevice, onRefresh }: DeviceListProps) => {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'tv':
        return 'Tv';
      case 'projector':
        return 'Projector';
      case 'dvd':
        return 'Disc3';
      default:
        return 'Radio';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Мои устройства</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="touch-feedback" onClick={onRefresh}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
          <Button variant="outline" size="sm" className="touch-feedback">
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить
          </Button>
        </div>
      </div>

      {devices.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon name="Radio" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Устройства не найдены</p>
          <Button variant="outline" className="mt-4" onClick={onRefresh}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить список
          </Button>
        </Card>
      ) : (
        devices.map((device) => (
          <Card
            key={device.id}
            className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer touch-feedback"
            onClick={() => onSelectDevice(device)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={getDeviceIcon(device.type)} className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{device.name}</h3>
                  <p className="text-sm text-muted-foreground">{device.model}</p>
                  {device.brand && (
                    <p className="text-xs text-muted-foreground">{device.brand}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={device.status === 'online' ? 'default' : 'secondary'}
                  className={
                    device.status === 'online'
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'bg-muted text-muted-foreground'
                  }
                >
                  {device.status === 'online' ? (
                    <>
                      <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse-glow" />
                      Онлайн
                    </>
                  ) : (
                    'Оффлайн'
                  )}
                </Badge>
                <Button variant="ghost" size="icon" className="touch-feedback">
                  <Icon name="ChevronRight" size={20} />
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default DeviceList;
