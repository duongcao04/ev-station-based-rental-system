CREATE EXTENSION IF NOT EXISTS "uuid-ossp";



CREATE TABLE IF NOT EXISTS stations (

    user_id UUID PRIMARY KEY,

    display_name VARCHAR(255) NOT NULL,

    address TEXT NOT NULL,

    latitude VARCHAR(50),

    longitude VARCHAR(50),

    count_vehicle INT DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW()

);



-- Tạo bảng station_vehicles (nhiều xe thuộc 1 trạm)

CREATE TABLE IF NOT EXISTS station_vehicles (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    user_id UUID NOT NULL REFERENCES stations(user_id) ON DELETE CASCADE,

    vehicle_id UUID NOT NULL,

    status VARCHAR(50) DEFAULT 'available',  -- available, rented, maintenance, unavailable

    battery_soc INT DEFAULT 100,  -- Battery state of charge (0-100)

    note TEXT,

    created_at TIMESTAMP DEFAULT NOW(),

    updated_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (user_id, vehicle_id)

);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_station_vehicles_user_id ON station_vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_station_vehicles_vehicle_id ON station_vehicles(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_station_vehicles_status ON station_vehicles(status);

-- Constraints
ALTER TABLE station_vehicles ADD CONSTRAINT chk_vehicle_status 
CHECK (status IN ('available', 'rented', 'maintenance', 'unavailable'));

ALTER TABLE station_vehicles ADD CONSTRAINT chk_battery_soc 
CHECK (battery_soc >= 0 AND battery_soc <= 100);


