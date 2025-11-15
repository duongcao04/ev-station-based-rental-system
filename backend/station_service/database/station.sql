CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS stations (
    station_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    count_vehicle INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS station_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES stations(station_id) ON DELETE CASCADE,
    vehicle_id UUID NOT NULL,
    status VARCHAR(50) DEFAULT 'available',
    battery_soc INT DEFAULT 100,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (station_id, vehicle_id)
);

-- Bảng station_staff_members đã được xóa vì không sử dụng
-- Staff assignment được quản lý qua users.station_id trong Auth Service database

CREATE INDEX IF NOT EXISTS idx_station_vehicles_station_id ON station_vehicles(station_id);
CREATE INDEX IF NOT EXISTS idx_station_vehicles_vehicle_id ON station_vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_station_vehicles_status ON station_vehicles(status);
ALTER TABLE station_vehicles ADD CONSTRAINT chk_vehicle_status 
CHECK (status IN ('available', 'rented', 'maintenance', 'unavailable'));
ALTER TABLE station_vehicles ADD CONSTRAINT chk_battery_soc 
CHECK (battery_soc >= 0 AND battery_soc <= 100);