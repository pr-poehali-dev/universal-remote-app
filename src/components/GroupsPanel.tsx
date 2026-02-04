import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const GroupsPanel = () => {
  const groups = [
    {
      name: 'Гостиная',
      devices: ['Telefunken TV', 'Samsung TV'],
      icon: 'Home',
    },
    {
      name: 'Спальня',
      devices: ['LG TV'],
      icon: 'BedDouble',
    },
    {
      name: 'Кинозал',
      devices: ['Sony Projector', 'Panasonic DVD'],
      icon: 'Film',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Группы устройств</h2>
        <Button variant="outline" size="sm" className="touch-feedback">
          <Icon name="Plus" size={16} className="mr-2" />
          Создать
        </Button>
      </div>

      {groups.map((group, index) => (
        <Card
          key={index}
          className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer touch-feedback"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={group.icon} className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{group.name}</h3>
                <p className="text-sm text-muted-foreground">{group.devices.length} устройств</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="touch-feedback">
              <Icon name="MoreVertical" size={20} />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {group.devices.map((device, idx) => (
              <Badge key={idx} variant="secondary" className="bg-secondary text-foreground">
                {device}
              </Badge>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" className="touch-feedback">
              <Icon name="Power" size={16} className="mr-2" />
              Вкл/Выкл
            </Button>
            <Button variant="outline" size="sm" className="touch-feedback">
              <Icon name="Volume2" size={16} className="mr-2" />
              Громкость
            </Button>
            <Button variant="outline" size="sm" className="touch-feedback">
              <Icon name="Settings" size={16} className="mr-2" />
              Настройки
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default GroupsPanel;
