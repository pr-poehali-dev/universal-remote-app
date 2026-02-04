import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useState } from 'react';

interface RemoteControlProps {
  device: {
    id: number;
    name: string;
    model: string;
    type: string;
    status: string;
  };
}

const RemoteControl = ({ device }: RemoteControlProps) => {
  const [sending, setSending] = useState(false);

  const handleButtonPress = async (command: string) => {
    if (sending) return;
    
    setSending(true);
    try {
      const result = await api.sendCommand(device.id, command);
      
      if (result.success) {
        toast({
          title: '✓ Команда отправлена',
          description: `ИК-код: ${result.ir_code}`,
          duration: 2000
        });
      }
    } catch (error) {
      toast({
        title: '✗ Ошибка отправки',
        description: 'Не удалось отправить команду',
        variant: 'destructive',
        duration: 3000
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('source')}
            >
              <Icon name="MonitorPlay" size={24} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 touch-feedback bg-destructive/20 hover:bg-destructive/40 text-destructive border-destructive/50"
              onClick={() => handleButtonPress('power')}
            >
              <Icon name="Power" size={24} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('menu')}
            >
              <Icon name="Menu" size={24} />
            </Button>
          </div>

          <div className="relative w-48 h-48">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="outline"
                size="icon"
                className="w-16 h-16 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary touch-feedback"
                onClick={() => handleButtonPress('ok')}
              >
                <Icon name="CircleDot" size={28} />
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary touch-feedback"
              onClick={() => handleButtonPress('up')}
            >
              <Icon name="ChevronUp" size={24} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary touch-feedback"
              onClick={() => handleButtonPress('down')}
            >
              <Icon name="ChevronDown" size={24} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary touch-feedback"
              onClick={() => handleButtonPress('left')}
            >
              <Icon name="ChevronLeft" size={24} />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary touch-feedback"
              onClick={() => handleButtonPress('right')}
            >
              <Icon name="ChevronRight" size={24} />
            </Button>
          </div>

          <div className="w-full grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              size="lg"
              className="h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('back')}
            >
              <Icon name="Undo2" size={24} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('home')}
            >
              <Icon name="Home" size={24} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('info')}
            >
              <Icon name="Info" size={24} />
            </Button>
          </div>

          <div className="w-full flex gap-3">
            <Button
              variant="outline"
              className="flex-1 h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('volume-down')}
            >
              <Icon name="Volume1" size={24} />
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('mute')}
            >
              <Icon name="VolumeX" size={24} />
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-14 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary"
              onClick={() => handleButtonPress('volume-up')}
            >
              <Icon name="Volume2" size={24} />
            </Button>
          </div>

          <div className="w-full grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num, idx) => (
              <Button
                key={num}
                variant="outline"
                className={`h-12 touch-feedback bg-secondary hover:bg-primary/20 hover:text-primary hover:border-primary ${
                  idx === 9 ? 'col-start-2' : ''
                }`}
                onClick={() => handleButtonPress(`num-${num}`)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RemoteControl;