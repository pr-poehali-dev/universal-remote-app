import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { api } from '@/lib/api';
import { toast } from '@/components/ui/use-toast';

interface AddDeviceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeviceAdded: () => void;
}

const DEFAULT_IR_CODES = {
  tv: {
    power: '0000',
    volume_up: '0001',
    volume_down: '0002',
    mute: '0003',
    channel_up: '0004',
    channel_down: '0005',
    up: '0010',
    down: '0011',
    left: '0012',
    right: '0013',
    ok: '0014',
    back: '0015',
    home: '0016',
    menu: '0017',
    source: '0018',
    info: '0019'
  },
  projector: {
    power: '0300',
    input: '0301',
    menu: '0302'
  },
  receiver: {
    power: '0500',
    volume_up: '0501',
    volume_down: '0502',
    mute: '0503',
    input: '0504'
  },
  dvd: {
    power: '0400',
    play: '0401',
    stop: '0402',
    pause: '0403'
  }
};

const AddDeviceDialog = ({ open, onOpenChange, onDeviceAdded }: AddDeviceDialogProps) => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('tv');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !brand || !model) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const irCodes = DEFAULT_IR_CODES[type as keyof typeof DEFAULT_IR_CODES] || DEFAULT_IR_CODES.tv;
      
      await api.createDevice({
        name,
        brand,
        model,
        type,
        ir_codes: irCodes,
        status: 'offline'
      });

      setName('');
      setBrand('');
      setModel('');
      setType('tv');
      onDeviceAdded();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось добавить устройство',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Добавить устройство</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Название устройства *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Samsung TV Гостиная"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">Бренд *</Label>
            <Input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Samsung, LG, Sony..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">Модель *</Label>
            <Input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="UE55, 43UM7020..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Тип устройства</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tv">Телевизор</SelectItem>
                <SelectItem value="projector">Проектор</SelectItem>
                <SelectItem value="receiver">Ресивер</SelectItem>
                <SelectItem value="dvd">DVD/Blu-ray</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-secondary/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <Icon name="Info" size={14} className="inline mr-1" />
              ИК-коды будут добавлены автоматически для выбранного типа устройства
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Добавление...
                </>
              ) : (
                <>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Добавить
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceDialog;
