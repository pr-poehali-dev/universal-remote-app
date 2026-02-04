const DEVICES_API = 'https://functions.poehali.dev/e9f095cf-2ce9-4b91-9f39-1da7290c2fec';
const IR_SEND_API = 'https://functions.poehali.dev/63e96d5e-48e5-4cbc-959b-f396cd43bdfc';
const SETTINGS_API = 'https://functions.poehali.dev/ec060a5a-e560-4168-b4b1-637a4a18176a';
const HISTORY_API = 'https://functions.poehali.dev/ff6f0a9e-5999-4e2f-a96d-44e6226ff5a2';
const IR_LEARN_API = 'https://functions.poehali.dev/7e3f1856-8985-41dd-a9f8-a381cd87af01';

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
    const response = await fetch(DEVICES_API);
    return response.json();
  },

  async createDevice(device: Omit<Device, 'id' | 'created_at' | 'updated_at'>): Promise<Device> {
    const response = await fetch(DEVICES_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    });
    return response.json();
  },

  async updateDevice(device: Device): Promise<Device> {
    const response = await fetch(DEVICES_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    });
    return response.json();
  },

  async deleteDevice(deviceId: number): Promise<{ message: string }> {
    const response = await fetch(`${DEVICES_API}?id=${deviceId}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  async sendCommand(deviceId: number, command: string): Promise<{ success: boolean; ir_code: string; message: string }> {
    const response = await fetch(IR_SEND_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: deviceId, command })
    });
    return response.json();
  },

  async getSettings(): Promise<Record<string, string>> {
    const response = await fetch(SETTINGS_API);
    return response.json();
  },

  async updateSettings(settings: Record<string, string>): Promise<{ message: string }> {
    const response = await fetch(SETTINGS_API, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return response.json();
  },

  async getHistory(): Promise<CommandHistory[]> {
    const response = await fetch(`${HISTORY_API}?action=history`);
    const data = await response.json();
    return data.history;
  },

  async getGroups(): Promise<DeviceGroup[]> {
    const response = await fetch(`${HISTORY_API}?action=groups`);
    const data = await response.json();
    return data.groups;
  },

  async addDevice(device: Omit<Device, 'id' | 'created_at' | 'status'>): Promise<{ id: number; message: string }> {
    const response = await fetch(`${HISTORY_API}?action=add_device`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(device)
    });
    return response.json();
  },

  async learnIRCode(deviceId: number, button: string, irCode: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(IR_LEARN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ device_id: deviceId, button, ir_code: irCode })
    });
    return response.json();
  }
};