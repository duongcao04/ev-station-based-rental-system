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

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE (user_id, vehicle_id)

);


