import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CustomizeRemote from '@/components/CustomizeRemote';

const SettingsPanel = () => {
  const [irEnabled, setIrEnabled] = useState(true);
  const [autoRecognition, setAutoRecognition] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [showCustomize, setShowCustomize] = useState(false);

  const handleScan = () => {
    toast({
      title: 'Сканирование устройств',
      description: 'Поиск ИК-устройств поблизости...',
      duration: 3000
    });
  };


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
            <h3 className="font-semibold text-foreground">ИК-порт {irEnabled ? 'активен' : 'выключен'}</h3>
            <p className="text-sm text-muted-foreground">{irEnabled ? 'Готов к работе' : 'Включите для работы'}</p>
          </div>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground touch-feedback"
          onClick={handleScan}
        >
          <Icon name="ScanSearch" size={18} className="mr-2" />
          Найти устройства
        </Button>
      </Card>

      <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Radio" className="text-foreground" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">ИК-порт</h3>
              <p className="text-sm text-muted-foreground">Управление инфракрасным передатчиком</p>
            </div>
          </div>
          <Switch checked={irEnabled} onCheckedChange={setIrEnabled} />
        </div>
      </Card>

      <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="ScanSearch" className="text-foreground" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Автораспознавание</h3>
              <p className="text-sm text-muted-foreground">Определение моделей устройств автоматически</p>
            </div>
          </div>
          <Switch checked={autoRecognition} onCheckedChange={setAutoRecognition} />
        </div>
      </Card>

      <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Smartphone" className="text-foreground" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Вибрация</h3>
              <p className="text-sm text-muted-foreground">Тактильный отклик при нажатии кнопок</p>
            </div>
          </div>
          <Switch checked={vibration} onCheckedChange={setVibration} />
        </div>
      </Card>

      <Dialog open={showCustomize} onOpenChange={setShowCustomize}>
        <DialogTrigger asChild>
          <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer touch-feedback">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Sliders" className="text-foreground" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Настройка пульта</h3>
                  <p className="text-sm text-muted-foreground">Изменить кнопки и макет</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="touch-feedback">
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Настройка макета пульта</DialogTitle>
          </DialogHeader>
          <CustomizeRemote onSave={(buttons) => {
            console.log('Saved buttons:', buttons);
            setShowCustomize(false);
            toast({
              title: 'Макет сохранён',
              description: 'Изменения применены к пульту',
              duration: 2000
            });
          }} />
        </DialogContent>
      </Dialog>

      <Card className="p-4 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer touch-feedback">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Info" className="text-foreground" size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">О приложении</h3>
              <p className="text-sm text-muted-foreground">Версия 1.0.0 • Build 2026.02</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="touch-feedback">
            <Icon name="ChevronRight" size={20} />
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPanel;