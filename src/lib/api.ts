const API_URL = 'https://functions.poehali.dev/ff6f0a9e-5999-4e2f-a96d-44e6226ff5a2';

export interface Device {
  id: number;
  name: string;
  model: string;
  type: string;
  brand?: string;
  status: string;
  ir_codes?: Record<string, string>;
  created_at?: string;
}

export interface CommandHistory {
  id: number;
  command: string;
  success: boolean;
  created_at: string;
  device_name: string;
  device_type: string;
}

export interface DeviceGroup {
  id: number;
  name: string;
  icon?: string;
  devices: Device[];
}

export const api = {
  async getDevices(): Promise<Device[]> {
    const response = await fetch(`${API_URL}?action=devices`);
    const data = await response.json();
    return data.devices;
  },

  async sendCommand(deviceId: number, command: string): Promise<{ success: boolean; ir_code: string; message: string }> {
    const response = await fetch(`${API_URL}?action=command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: deviceId, command })
    });
    return response.json();
  },

  async getHistory(): Promise<CommandHistory[]> {
    const response = await fetch(`${API_URL}?action=history`);
    const data = await response.json();
    return data.history;
  },

  async getGroups(): Promise<DeviceGroup[]> {
    const response = await fetch(`${API_URL}?action=groups`);
    const data = await response.json();
    return data.groups;
  },

  async addDevice(device: Omit<Device, 'id' | 'created_at' | 'status'>): Promise<{ id: number; message: string }> {
    const response = await fetch(`${API_URL}?action=add_device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    });
    return response.json();
  }
};
