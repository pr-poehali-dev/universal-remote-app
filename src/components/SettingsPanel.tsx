import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CustomizeRemote from '@/components/CustomizeRemote';
import AddDeviceDialog from '@/components/AddDeviceDialog';
import { api, type Device } from '@/lib/api';

const SettingsPanel = () => {
  const [irEnabled, setIrEnabled] = useState(true);
  const [autoRecognition, setAutoRecognition] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [irEndpoint, setIrEndpoint] = useState('');
  const [showCustomize, setShowCustomize] = useState(false);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    loadDevices();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await api.getSettings();
      setIrEndpoint(settings.ir_endpoint || '');
      setAutoRecognition(settings.auto_detect === 'true');
      setIrEnabled(settings.ir_port !== 'disabled');
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await api.getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to load devices:', error);
      toast({
        title: 'Ошибка загрузки',
        description: 'Не удалось загрузить список устройств',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEndpoint = async () => {
    try {
      await api.updateSettings({ ir_endpoint: irEndpoint });
      toast({
        title: 'Сохранено',
        description: 'Адрес ИК-передатчика обновлён',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки',
        variant: 'destructive'
      });
    }
  };

  const handleScan = () => {
    toast({
      title: 'Сканирование устройств',
      description: 'Поиск ИК-устройств поблизости...',
      duration: 3000
    });
  };

  const handleDeleteDevice = async (deviceId: number) => {
    if (!confirm('Удалить это устройство?')) return;
    
    try {
      await api.deleteDevice(deviceId);
      toast({
        title: 'Устройство удалено',
        description: 'Устройство успешно удалено из списка',
        duration: 2000
      });
      loadDevices();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить устройство',
        variant: 'destructive'
      });
    }
  };

  const handleDeviceAdded = () => {
    setShowAddDevice(false);
    loadDevices();
    toast({
      title: 'Устройство добавлено',
      description: 'Новое устройство успешно добавлено',
      duration: 2000
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

      <Card className="p-4 bg-card border-border">
        <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
          <Icon name="Network" size={18} />
          Адрес ИК-передатчика
        </h3>
        <div className="space-y-2">
          <Label htmlFor="ir-endpoint" className="text-sm text-muted-foreground">
            HTTP URL для отправки команд (например: http://192.168.1.100:8080/send)
          </Label>
          <div className="flex gap-2">
            <Input
              id="ir-endpoint"
              type="text"
              value={irEndpoint}
              onChange={(e) => setIrEndpoint(e.target.value)}
              placeholder="http://192.168.1.100:8080/send"
              className="flex-1"
            />
            <Button onClick={handleSaveEndpoint} className="touch-feedback">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Укажите IP-адрес вашего ИК-передатчика в локальной сети
          </p>
        </div>
      </Card>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-foreground flex items-center gap-2">
            <Icon name="Tv" size={18} />
            Устройства ({devices.length})
          </h3>
          <Button
            onClick={() => setShowAddDevice(true)}
            size="sm"
            className="touch-feedback"
          >
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <Icon name="Loader2" size={24} className="mx-auto text-muted-foreground animate-spin" />
          </div>
        ) : devices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Нет добавленных устройств
          </p>
        ) : (
          <div className="space-y-2">
            {devices.map((device) => (
              <div
                key={device.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Icon name="Tv" size={20} className="text-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{device.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {device.brand} • {device.model}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDevice(device.id)}
                  className="touch-feedback"
                >
                  <Icon name="Trash2" size={16} className="text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        )}
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

      <AddDeviceDialog
        open={showAddDevice}
        onOpenChange={setShowAddDevice}
        onDeviceAdded={handleDeviceAdded}
      />

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
