CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    brand VARCHAR(100),
    ir_codes JSONB,
    status VARCHAR(20) DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS device_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS group_devices (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES device_groups(id),
    device_id INTEGER REFERENCES devices(id),
    UNIQUE(group_id, device_id)
);

CREATE TABLE IF NOT EXISTS command_history (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    command VARCHAR(100) NOT NULL,
    success BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    command VARCHAR(100) NOT NULL,
    label VARCHAR(255),
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS remote_layouts (
    id SERIAL PRIMARY KEY,
    device_id INTEGER REFERENCES devices(id),
    layout_data JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO devices (name, model, type, brand, status, ir_codes) VALUES
    ('Telefunken TV', 'TF-LED32S52T2S', 'tv', 'Telefunken', 'online', '{"power": "0000", "volume_up": "0001", "volume_down": "0002", "mute": "0003", "up": "0010", "down": "0011", "left": "0012", "right": "0013", "ok": "0014", "back": "0015", "home": "0016", "menu": "0017", "source": "0018", "info": "0019"}'),
    ('Samsung TV', 'UE55', 'tv', 'Samsung', 'online', '{"power": "0100", "volume_up": "0101", "volume_down": "0102", "mute": "0103", "up": "0110", "down": "0111", "left": "0112", "right": "0113", "ok": "0114", "back": "0115", "home": "0116", "menu": "0117", "source": "0118", "info": "0119"}'),
    ('LG TV', '43UM7020', 'tv', 'LG', 'offline', '{"power": "0200", "volume_up": "0201", "volume_down": "0202", "mute": "0203", "up": "0210", "down": "0211", "left": "0212", "right": "0213", "ok": "0214", "back": "0215", "home": "0216", "menu": "0217", "source": "0218", "info": "0219"}'),
    ('Sony Projector', 'VPL-VW290ES', 'projector', 'Sony', 'online', '{"power": "0300", "input": "0301", "menu": "0302"}'),
    ('Panasonic DVD', 'DMP-BDT180', 'dvd', 'Panasonic', 'offline', '{"power": "0400", "play": "0401", "stop": "0402", "pause": "0403"}');