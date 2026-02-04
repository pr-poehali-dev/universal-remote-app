import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const SettingsPanel = () => {
  const settings = [
    {
      title: 'ИК-порт',
      description: 'Управление инфракрасным передатчиком',
      icon: 'Radio',
      status: 'active',
      hasSwitch: true,
    },
    {
      title: 'Автораспознавание',
      description: 'Определение моделей устройств автоматически',
      icon: 'ScanSearch',
      status: 'active',
      hasSwitch: true,
    },
    {
      title: 'Вибрация',
      description: 'Тактильный отклик при нажатии кнопок',
      icon: 'Smartphone',
      status: 'active',
      hasSwitch: true,
    },
    {
      title: 'База устройств',
      description: 'Обновить библиотеку поддерживаемых моделей',
      icon: 'Database',
      status: 'info',
      hasSwitch: false,
    },
    {
      title: 'О приложении',
      description: 'Версия 1.0.0 • Build 2024.02',
      icon: 'Info',
      status: 'info',
      hasSwitch: false,
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Настройки</h2>
      </div>

      <Card className="p-4 bg-card border-border mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Radio" className="text-primary" size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">ИК-порт активен</h3>
            <p className="text-sm text-muted-foreground">Готов к работе</p>
          </div>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground touch-feedback">
          <Icon name="ScanSearch" size={18} className="mr-2" />
          Найти устройства
        </Button>
      </Card>

      {settings.map((setting, index) => (
        <Card
          key={index}
          className="p-4 bg-card border-border hover:border-primary/50 transition-colors touch-feedback"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                <Icon name={setting.icon} className="text-foreground" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-foreground">{setting.title}</h3>
                  {setting.status === 'active' && (
                    <Badge variant="outline" className="bg-primary/10 border-primary/30 text-primary">
                      <div className="w-2 h-2 rounded-full bg-primary mr-1" />
                      Вкл
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              </div>
            </div>
            {setting.hasSwitch ? (
              <Switch defaultChecked={setting.status === 'active'} />
            ) : (
              <Button variant="ghost" size="icon" className="touch-feedback">
                <Icon name="ChevronRight" size={20} />
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SettingsPanel;
