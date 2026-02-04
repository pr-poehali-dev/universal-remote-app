import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface RemoteButton {
  id: string;
  label: string;
  command: string;
  icon: string;
}

interface CustomizeRemoteProps {
  onSave: (buttons: RemoteButton[]) => void;
}

const CustomizeRemote = ({ onSave }: CustomizeRemoteProps) => {
  const [buttons, setButtons] = useState<RemoteButton[]>([
    { id: '1', label: 'Питание', command: 'power', icon: 'Power' },
    { id: '2', label: 'Источник', command: 'source', icon: 'MonitorPlay' },
    { id: '3', label: 'Меню', command: 'menu', icon: 'Menu' },
  ]);

  const [editingButton, setEditingButton] = useState<RemoteButton | null>(null);

  const availableIcons = [
    'Power', 'Volume2', 'Volume1', 'VolumeX', 'Tv', 'MonitorPlay', 
    'Menu', 'Home', 'Info', 'Play', 'Pause', 'SkipForward', 
    'SkipBack', 'CircleDot', 'Radio', 'Disc3'
  ];

  const handleSaveButton = () => {
    if (editingButton) {
      setButtons(buttons.map(b => b.id === editingButton.id ? editingButton : b));
      setEditingButton(null);
    }
  };

  const handleAddButton = () => {
    const newButton: RemoteButton = {
      id: Date.now().toString(),
      label: 'Новая кнопка',
      command: 'custom',
      icon: 'Radio'
    };
    setButtons([...buttons, newButton]);
  };

  const handleDeleteButton = (id: string) => {
    setButtons(buttons.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Настройка пульта</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleAddButton}>
            <Icon name="Plus" size={16} className="mr-2" />
            Добавить кнопку
          </Button>
          <Button variant="default" size="sm" onClick={() => onSave(buttons)}>
            <Icon name="Save" size={16} className="mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {buttons.map((button) => (
          <Card key={button.id} className="p-4 bg-card border-border">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                  <Icon name={button.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">{button.label}</p>
                  <p className="text-xs text-muted-foreground">{button.command}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => setEditingButton(button)}
                    >
                      <Icon name="Pencil" size={14} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Редактировать кнопку</DialogTitle>
                      <DialogDescription>
                        Измените название, команду и иконку кнопки
                      </DialogDescription>
                    </DialogHeader>
                    {editingButton && (
                      <div className="space-y-4 mt-4">
                        <div>
                          <Label htmlFor="label">Название</Label>
                          <Input
                            id="label"
                            value={editingButton.label}
                            onChange={(e) => setEditingButton({ ...editingButton, label: e.target.value })}
                            placeholder="Питание"
                          />
                        </div>
                        <div>
                          <Label htmlFor="command">Команда</Label>
                          <Input
                            id="command"
                            value={editingButton.command}
                            onChange={(e) => setEditingButton({ ...editingButton, command: e.target.value })}
                            placeholder="power"
                          />
                        </div>
                        <div>
                          <Label htmlFor="icon">Иконка</Label>
                          <Select
                            value={editingButton.icon}
                            onValueChange={(value) => setEditingButton({ ...editingButton, icon: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {availableIcons.map((icon) => (
                                <SelectItem key={icon} value={icon}>
                                  <div className="flex items-center gap-2">
                                    <Icon name={icon} size={16} />
                                    {icon}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button onClick={handleSaveButton} className="w-full">
                          Сохранить
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDeleteButton(button.id)}
                >
                  <Icon name="Trash2" size={14} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomizeRemote;
