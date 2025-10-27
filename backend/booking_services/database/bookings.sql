
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE bookings (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id INTEGER NOT NULL,     
    vehicle_id UUID NOT NULL,     
    payment_id UUID,              
    start_station_id VARCHAR(50) NOT NULL,  
    end_station_id VARCHAR(50) NOT NULL,    
    actual_return_station_id VARCHAR(50),   
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    total_amount NUMERIC(12, 2) NOT NULL,
    calculated_price_details JSONB, 
    status VARCHAR(50) NOT NULL DEFAULT 'booked', 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_vehicle_id ON bookings(vehicle_id);
CREATE INDEX idx_bookings_payment_id ON bookings(payment_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);
CREATE INDEX idx_bookings_start_station_id ON bookings(start_station_id);
CREATE INDEX idx_bookings_end_station_id ON bookings(end_station_id);
CREATE INDEX idx_bookings_actual_return_station_id ON bookings(actual_return_station_id);

-- Composite indexes cho queries phổ biến
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_bookings_vehicle_dates ON bookings(vehicle_id, start_date, end_date);
CREATE INDEX idx_bookings_station_status ON bookings(start_station_id, status);


ALTER TABLE bookings ADD CONSTRAINT chk_booking_status 
CHECK (status IN ('booked', 'ongoing', 'completed', 'cancelled'));


ALTER TABLE bookings ADD CONSTRAINT chk_booking_dates 
CHECK (end_date > start_date);

ALTER TABLE bookings ADD CONSTRAINT chk_total_amount 
CHECK (total_amount >= 0);


INSERT INTO bookings (user_id, vehicle_id, start_station_id, end_station_id, start_date, end_date, total_amount, calculated_price_details, status) VALUES
(1001, '550e8400-e29b-41d4-a716-446655440001', 'station-001', 'station-001', '2024-01-15 09:00:00+07', '2024-01-15 17:00:00+07', 400.00, 
 '{"pricing_type": "daily", "price_per_day": 50.00, "duration_days": 8, "base_cost": 400.00}', 'booked'),
 
(1002, '550e8400-e29b-41d4-a716-446655440002', 'station-002', 'station-002', '2024-01-16 08:00:00+07', '2024-01-20 18:00:00+07', 200.00,
 '{"pricing_type": "daily", "price_per_day": 50.00, "duration_days": 4, "base_cost": 200.00}', 'ongoing'),
 
(1003, '550e8400-e29b-41d4-a716-446655440003', 'station-003', 'station-001', '2024-01-10 10:00:00+07', '2024-01-12 16:00:00+07', 100.00,
 '{"pricing_type": "daily", "price_per_day": 50.00, "duration_days": 2, "base_cost": 100.00}', 'completed');
