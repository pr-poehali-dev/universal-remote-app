import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { api, type DeviceGroup } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

const GroupsPanel = () => {
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await api.getGroups();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить группы устройств',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGroupCommand = (groupId: number, command: string) => {
    toast({
      title: 'Команда отправлена',
      description: `Выполнение "${command}" для всех устройств в группе`,
      duration: 2000
    });
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Loader2" size={48} className="mx-auto text-muted-foreground mb-4 animate-spin" />
        <p className="text-muted-foreground">Загрузка групп...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Группы устройств</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="touch-feedback" onClick={loadGroups}>
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Обновить
          </Button>
          <Button variant="outline" size="sm" className="touch-feedback">
            <Icon name="Plus" size={16} className="mr-2" />
            Создать
          </Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon name="Layers" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Группы не созданы</p>
          <Button variant="outline">
            <Icon name="Plus" size={16} className="mr-2" />
            Создать первую группу
          </Button>
        </Card>
      ) : (
        groups.map((group) => (
          <Card
            key={group.id}
            className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer touch-feedback"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={group.icon || 'Layers'} className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.devices?.length || 0} устройств</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="touch-feedback">
                <Icon name="MoreVertical" size={20} />
              </Button>
            </div>

            {group.devices && group.devices.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {group.devices.map((device: any, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-secondary text-foreground">
                    {device.name || device}
                  </Badge>
                ))}
              </div>
            )}

            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="touch-feedback"
                onClick={() => handleGroupCommand(group.id, 'power')}
              >
                <Icon name="Power" size={16} className="mr-1" />
                Вкл/Выкл
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="touch-feedback"
                onClick={() => handleGroupCommand(group.id, 'volume')}
              >
                <Icon name="Volume2" size={16} className="mr-1" />
                Звук
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="touch-feedback"
                onClick={() => handleGroupCommand(group.id, 'mute')}
              >
                <Icon name="VolumeX" size={16} className="mr-1" />
                Mute
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default GroupsPanel;