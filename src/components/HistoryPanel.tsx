import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const HistoryPanel = () => {
  const history = [
    {
      action: 'Включение питания',
      device: 'Telefunken TV',
      time: '2 минуты назад',
      icon: 'Power',
      success: true,
    },
    {
      action: 'Переключение канала',
      device: 'Samsung TV',
      time: '15 минут назад',
      icon: 'Tv',
      success: true,
    },
    {
      action: 'Регулировка громкости',
      device: 'Telefunken TV',
      time: '1 час назад',
      icon: 'Volume2',
      success: true,
    },
    {
      action: 'Попытка подключения',
      device: 'LG TV',
      time: '2 часа назад',
      icon: 'WifiOff',
      success: false,
    },
    {
      action: 'Включение проектора',
      device: 'Sony Projector',
      time: '5 часов назад',
      icon: 'Projector',
      success: true,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">История действий</h2>
        <Button variant="outline" size="sm" className="touch-feedback">
          <Icon name="Trash2" size={16} className="mr-2" />
          Очистить
        </Button>
      </div>

      {history.map((item, index) => (
        <Card
          key={index}
          className="p-4 bg-card border-border hover:border-primary/50 transition-colors touch-feedback"
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                item.success ? 'bg-primary/10' : 'bg-destructive/10'
              }`}
            >
              <Icon
                name={item.icon}
                className={item.success ? 'text-primary' : 'text-destructive'}
                size={20}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-foreground">{item.action}</h3>
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
              <p className="text-sm text-muted-foreground">{item.device}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
            </div>
            <Button variant="ghost" size="icon" className="touch-feedback">
              <Icon name="RotateCcw" size={18} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default HistoryPanel;
