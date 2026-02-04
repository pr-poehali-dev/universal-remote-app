import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Device {
  name: string;
  model: string;
  type: string;
  status: string;
}

interface DeviceListProps {
  onSelectDevice: (device: Device) => void;
}

const DeviceList = ({ onSelectDevice }: DeviceListProps) => {
  const devices: Device[] = [
    { name: 'Telefunken TV', model: 'TF-LED32S52T2S', type: 'tv', status: 'online' },
    { name: 'Samsung TV', model: 'UE55', type: 'tv', status: 'online' },
    { name: 'LG TV', model: '43UM7020', type: 'tv', status: 'offline' },
    { name: 'Sony Projector', model: 'VPL-VW290ES', type: 'projector', status: 'online' },
    { name: 'Panasonic DVD', model: 'DMP-BDT180', type: 'dvd', status: 'offline' },
  ];

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
        <Button variant="outline" size="sm" className="touch-feedback">
          <Icon name="Plus" size={16} className="mr-2" />
          Добавить
        </Button>
      </div>

      {devices.map((device, index) => (
        <Card
          key={index}
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
      ))}
    </div>
  );
};

export default DeviceList;
