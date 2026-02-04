import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from '@/components/ui/use-toast';
import { api, type Device } from '@/lib/api';

interface LearnModeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device;
  onComplete: () => void;
}

const BUTTONS_TO_LEARN = [
  { id: 'power', label: 'Питание', icon: 'Power' },
  { id: 'volume_up', label: 'Громкость +', icon: 'VolumeX' },
  { id: 'volume_down', label: 'Громкость -', icon: 'Volume' },
  { id: 'mute', label: 'Без звука', icon: 'VolumeX' },
  { id: 'channel_up', label: 'Канал +', icon: 'ChevronUp' },
  { id: 'channel_down', label: 'Канал -', icon: 'ChevronDown' },
  { id: 'up', label: 'Вверх', icon: 'ArrowUp' },
  { id: 'down', label: 'Вниз', icon: 'ArrowDown' },
  { id: 'left', label: 'Влево', icon: 'ArrowLeft' },
  { id: 'right', label: 'Вправо', icon: 'ArrowRight' },
  { id: 'ok', label: 'OK', icon: 'Check' },
  { id: 'back', label: 'Назад', icon: 'Undo' },
  { id: 'home', label: 'Домой', icon: 'Home' },
  { id: 'menu', label: 'Меню', icon: 'Menu' }
];

const LearnModeDialog = ({ open, onOpenChange, device, onComplete }: LearnModeDialogProps) => {
  const [currentButtonIndex, setCurrentButtonIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [learnedButtons, setLearnedButtons] = useState<Set<string>>(new Set());
  const [skippedButtons, setSkippedButtons] = useState<Set<string>>(new Set());

  const currentButton = BUTTONS_TO_LEARN[currentButtonIndex];
  const progress = ((currentButtonIndex + 1) / BUTTONS_TO_LEARN.length) * 100;

  useEffect(() => {
    if (!open) {
      setCurrentButtonIndex(0);
      setLearnedButtons(new Set());
      setSkippedButtons(new Set());
      setIsListening(false);
    }
  }, [open]);

  const startListening = async () => {
    setIsListening(true);
    
    try {
      // Получаем настройки с адресом ИК-приёмника
      const settings = await api.getSettings();
      const irEndpoint = settings.ir_endpoint;
      
      if (!irEndpoint) {
        toast({
          title: 'Ошибка',
          description: 'Не указан адрес ИК-приёмника в настройках',
          variant: 'destructive'
        });
        setIsListening(false);
        return;
      }

      // Запрос на получение ИК-кода с приёмника
      const response = await fetch(`${irEndpoint}/receive`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000) // 10 секунд на получение
      });

      if (!response.ok) {
        throw new Error('Failed to receive IR code');
      }

      const data = await response.json();
      const irCode = data.code;

      if (!irCode) {
        throw new Error('No IR code received');
      }

      // Сохраняем код в БД
      await api.learnIRCode(device.id, currentButton.id, irCode);

      setLearnedButtons(prev => new Set([...prev, currentButton.id]));
      
      toast({
        title: 'Код записан',
        description: `Кнопка "${currentButton.label}" успешно обучена`,
        duration: 2000
      });

      // Переход к следующей кнопке
      setTimeout(() => {
        if (currentButtonIndex < BUTTONS_TO_LEARN.length - 1) {
          setCurrentButtonIndex(prev => prev + 1);
        } else {
          handleComplete();
        }
        setIsListening(false);
      }, 1000);

    } catch (error) {
      console.error('Learn error:', error);
      toast({
        title: 'Ошибка записи',
        description: error instanceof Error ? error.message : 'Не удалось получить ИК-код',
        variant: 'destructive'
      });
      setIsListening(false);
    }
  };

  const handleSkip = () => {
    setSkippedButtons(prev => new Set([...prev, currentButton.id]));
    
    if (currentButtonIndex < BUTTONS_TO_LEARN.length - 1) {
      setCurrentButtonIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    toast({
      title: 'Обучение завершено',
      description: `Записано кнопок: ${learnedButtons.size} из ${BUTTONS_TO_LEARN.length}`,
      duration: 3000
    });
    onComplete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Обучение пульта</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-secondary/50 p-4 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={currentButton.icon as any} size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{currentButton.label}</h3>
                <p className="text-sm text-muted-foreground">
                  Кнопка {currentButtonIndex + 1} из {BUTTONS_TO_LEARN.length}
                </p>
              </div>
            </div>
            
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground text-center">
              Обучено: {learnedButtons.size} • Пропущено: {skippedButtons.size}
            </p>
          </div>

          {!isListening ? (
            <div className="space-y-3">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm text-foreground">
                    <p className="font-medium mb-1">Как обучить кнопку:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Нажмите "Начать запись"</li>
                      <li>Направьте пульт на ИК-приёмник</li>
                      <li>Нажмите кнопку "{currentButton.label}" на пульте</li>
                      <li>Дождитесь подтверждения записи</li>
                    </ol>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="flex-1"
                >
                  <Icon name="SkipForward" size={16} className="mr-2" />
                  Пропустить
                </Button>
                <Button
                  onClick={startListening}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <Icon name="Radio" size={16} className="mr-2" />
                  Начать запись
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Icon name="Radio" size={48} className="text-green-500 animate-pulse" />
                    <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-foreground mb-1">
                      Ожидание сигнала...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Нажмите кнопку "{currentButton.label}" на пульте
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setIsListening(false)}
                variant="outline"
                className="w-full"
              >
                Отмена
              </Button>
            </div>
          )}

          {currentButtonIndex === BUTTONS_TO_LEARN.length - 1 && !isListening && (
            <Button
              onClick={handleComplete}
              variant="outline"
              className="w-full"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Завершить обучение
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LearnModeDialog;
