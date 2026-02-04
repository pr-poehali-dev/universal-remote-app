import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { api, type CommandHistory } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

const HistoryPanel = () => {
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistory(data);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCommandIcon = (command: string) => {
    const iconMap: Record<string, string> = {
      power: 'Power',
      volume_up: 'Volume2',
      volume_down: 'Volume1',
      mute: 'VolumeX',
      up: 'ChevronUp',
      down: 'ChevronDown',
      left: 'ChevronLeft',
      right: 'ChevronRight',
      ok: 'CircleDot',
      back: 'Undo2',
      home: 'Home',
      menu: 'Menu',
      source: 'MonitorPlay',
      info: 'Info'
    };
    return iconMap[command] || 'Radio';
  };

  const getCommandLabel = (command: string) => {
    const labelMap: Record<string, string> = {
      power: 'Питание',
      volume_up: 'Громкость +',
      volume_down: 'Громкость -',
      mute: 'Без звука',
      up: 'Вверх',
      down: 'Вниз',
      left: 'Влево',
      right: 'Вправо',
      ok: 'OK',
      back: 'Назад',
      home: 'Домой',
      menu: 'Меню',
      source: 'Источник',
      info: 'Информация'
    };
    return labelMap[command] || command;
  };

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <Icon name="Loader2" size={48} className="mx-auto text-muted-foreground mb-4 animate-spin" />
        <p className="text-muted-foreground">Загрузка истории...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">История действий</h2>
        <Button variant="outline" size="sm" className="touch-feedback" onClick={loadHistory}>
          <Icon name="RefreshCw" size={16} className="mr-2" />
          Обновить
        </Button>
      </div>

      {history.length === 0 ? (
        <Card className="p-8 text-center">
          <Icon name="History" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">История пуста</p>
        </Card>
      ) : (
        history.map((item) => (
          <Card
            key={item.id}
            className="p-4 bg-card border-border hover:border-primary/50 transition-colors touch-feedback"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.success ? 'bg-primary/10' : 'bg-destructive/10'
                }`}
              >
                <Icon
                  name={getCommandIcon(item.command)}
                  className={item.success ? 'text-primary' : 'text-destructive'}
                  size={20}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{getCommandLabel(item.command)}</h3>
                  <Badge
                    variant={item.success ? 'default' : 'destructive'}
                    className={
                      item.success
                        ? 'bg-primary/20 text-primary border-primary/30'
                        : 'bg-destructive/20 text-destructive border-destructive/30'
                    }
                  >
                    {item.success ? 'Успешно' : 'Ошибка'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.device_name}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ru })}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="touch-feedback" onClick={() => console.log('Repeat command:', item.command)}>
                <Icon name="RotateCcw" size={18} />
              </Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default HistoryPanel;
