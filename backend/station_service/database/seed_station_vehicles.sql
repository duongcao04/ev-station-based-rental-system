-- ========================================
-- ĐỒNG BỘ VEHICLES VỚI UUID MỚI TỪ BẢNG Car
-- ========================================

-- 1. Xóa dữ liệu cũ trong station_vehicles
TRUNCATE TABLE station_vehicles;

-- ========================================
-- 2. THÊM VEHICLES VÀO HÀ NỘI (5 trạm)
-- ========================================

-- Ga Hà Nội
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440001'::uuid, '1a2b3c4d-0001-4e7f-a123-000000000001'::uuid, 'available', 100, 'Tesla Model 3 - Xe mới, pin đầy'),
('650e8400-e29b-41d4-a716-446655440001'::uuid, '1a2b3c4d-0002-4e7f-a123-000000000002'::uuid, 'available', 95, 'Tesla Model X - Xe tốt'),
('650e8400-e29b-41d4-a716-446655440001'::uuid, '1a2b3c4d-0003-4e7f-a123-000000000003'::uuid, 'available', 90, 'Hyundai Kona EV')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Hà Nội 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440006'::uuid, '1a2b3c4d-0004-4e7f-a123-000000000004'::uuid, 'available', 100, 'Kia EV6 - Xe mới'),
('650e8400-e29b-41d4-a716-446655440006'::uuid, '1a2b3c4d-0005-4e7f-a123-000000000005'::uuid, 'available', 85, 'BMW i4')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Hà Nội 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440007'::uuid, '1a2b3c4d-0006-4e7f-a123-000000000006'::uuid, 'available', 95, 'BMW iX'),
('650e8400-e29b-41d4-a716-446655440007'::uuid, '1a2b3c4d-0007-4e7f-a123-000000000007'::uuid, 'available', 80, 'Mercedes EQS')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Hà Nội 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440008'::uuid, '1a2b3c4d-0008-4e7f-a123-000000000008'::uuid, 'available', 90, 'Mercedes EQC'),
('650e8400-e29b-41d4-a716-446655440008'::uuid, '1a2b3c4d-0009-4e7f-a123-000000000009'::uuid, 'available', 85, 'Volkswagen ID.3')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 3. THÊM VEHICLES VÀO TP.HCM (4 trạm)
-- ========================================

-- Ga TP.HCM
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440002'::uuid, '1a2b3c4d-0010-4e7f-a123-000000000010'::uuid, 'available', 100, 'Volkswagen ID.4 - Xe cao cấp'),
('650e8400-e29b-41d4-a716-446655440002'::uuid, '1a2b3c4d-0011-4e7f-a123-000000000011'::uuid, 'available', 95, 'Porsche Taycan - Xe tốt'),
('650e8400-e29b-41d4-a716-446655440002'::uuid, '1a2b3c4d-0012-4e7f-a123-000000000012'::uuid, 'available', 90, 'Kia Niro EV')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga TP.HCM 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440009'::uuid, '1a2b3c4d-0013-4e7f-a123-000000000013'::uuid, 'available', 100, 'Hyundai Ioniq 5'),
('650e8400-e29b-41d4-a716-446655440009'::uuid, '1a2b3c4d-0014-4e7f-a123-000000000014'::uuid, 'available', 95, 'Tesla Model Y')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga TP.HCM 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440010'::uuid, '1a2b3c4d-0015-4e7f-a123-000000000015'::uuid, 'available', 100, 'BMW iX3'),
('650e8400-e29b-41d4-a716-446655440010'::uuid, '1a2b3c4d-0016-4e7f-a123-000000000016'::uuid, 'available', 85, 'Volkswagen ID.5')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga TP.HCM 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440011'::uuid, '1a2b3c4d-0017-4e7f-a123-000000000017'::uuid, 'available', 90, 'Kia Soul EV'),
('650e8400-e29b-41d4-a716-446655440011'::uuid, '1a2b3c4d-0018-4e7f-a123-000000000018'::uuid, 'available', 80, 'Porsche Taycan 4S')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 4. THÊM VEHICLES VÀO ĐÀ NẴNG (4 trạm)
-- ========================================

-- Ga Đà Nẵng
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440003'::uuid, '1a2b3c4d-0001-4e7f-a123-000000000001'::uuid, 'available', 100, 'Tesla Model 3 - Xe sẵn sàng'),
('650e8400-e29b-41d4-a716-446655440003'::uuid, '1a2b3c4d-0019-4e7f-a123-000000000019'::uuid, 'available', 95, 'Hyundai Ioniq 6')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Đà Nẵng 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440012'::uuid, '1a2b3c4d-0020-4e7f-a123-000000000020'::uuid, 'available', 90, 'Tesla Model S'),
('650e8400-e29b-41d4-a716-446655440012'::uuid, '1a2b3c4d-0003-4e7f-a123-000000000003'::uuid, 'available', 85, 'Hyundai Kona EV')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Đà Nẵng 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440013'::uuid, '1a2b3c4d-0004-4e7f-a123-000000000004'::uuid, 'available', 80, 'Kia EV6'),
('650e8400-e29b-41d4-a716-446655440013'::uuid, '1a2b3c4d-0005-4e7f-a123-000000000005'::uuid, 'available', 75, 'BMW i4')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Đà Nẵng 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440014'::uuid, '1a2b3c4d-0006-4e7f-a123-000000000006'::uuid, 'available', 90, 'BMW iX')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 5. THÊM VEHICLES VÀO NHA TRANG (4 trạm)
-- ========================================

-- Ga Nha Trang
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440004'::uuid, '1a2b3c4d-0007-4e7f-a123-000000000007'::uuid, 'available', 100, 'Mercedes EQS - Xe mới'),
('650e8400-e29b-41d4-a716-446655440004'::uuid, '1a2b3c4d-0008-4e7f-a123-000000000008'::uuid, 'available', 95, 'Mercedes EQC')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Nha Trang 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440015'::uuid, '1a2b3c4d-0009-4e7f-a123-000000000009'::uuid, 'available', 90, 'Volkswagen ID.3'),
('650e8400-e29b-41d4-a716-446655440015'::uuid, '1a2b3c4d-0010-4e7f-a123-000000000010'::uuid, 'available', 85, 'Volkswagen ID.4')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Nha Trang 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440016'::uuid, '1a2b3c4d-0011-4e7f-a123-000000000011'::uuid, 'available', 80, 'Porsche Taycan')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Nha Trang 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440017'::uuid, '1a2b3c4d-0012-4e7f-a123-000000000012'::uuid, 'available', 85, 'Kia Niro EV')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 6. THÊM VEHICLES VÀO HUẾ (4 trạm)
-- ========================================

-- Ga Huế
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440005'::uuid, '1a2b3c4d-0013-4e7f-a123-000000000013'::uuid, 'available', 95, 'Hyundai Ioniq 5'),
('650e8400-e29b-41d4-a716-446655440005'::uuid, '1a2b3c4d-0014-4e7f-a123-000000000014'::uuid, 'available', 90, 'Tesla Model Y')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Huế 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440018'::uuid, '1a2b3c4d-0015-4e7f-a123-000000000015'::uuid, 'available', 85, 'BMW iX3')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Huế 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440019'::uuid, '1a2b3c4d-0016-4e7f-a123-000000000016'::uuid, 'available', 80, 'Volkswagen ID.5')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Huế 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES 
('650e8400-e29b-41d4-a716-446655440020'::uuid, '1a2b3c4d-0017-4e7f-a123-000000000017'::uuid, 'available', 85, 'Kia Soul EV')
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 7. UPDATE count_vehicle CHO TẤT CẢ STATIONS
-- ========================================
UPDATE stations SET count_vehicle = (
    SELECT COUNT(*) 
    FROM station_vehicles 
    WHERE station_vehicles.station_id = stations.station_id
);

-- ========================================
-- 8. XEM KẾT QUẢ TỔNG HỢP
-- ========================================
-- SELECT 
--     s.station_id,
--     s.user_id,
--     s.display_name,
--     s.address,
--     s.count_vehicle,
--     COUNT(sv.vehicle_id) as total_vehicles,
--     COUNT(CASE WHEN sv.status = 'available' THEN 1 END) as available_vehicles,
--     COUNT(CASE WHEN sv.status = 'rented' THEN 1 END) as rented_vehicles,
--     COUNT(CASE WHEN sv.status = 'maintenance' THEN 1 END) as maintenance_vehicles
-- FROM stations s
-- LEFT JOIN station_vehicles sv ON s.station_id = sv.station_id
-- GROUP BY s.station_id, s.user_id, s.display_name, s.address, s.count_vehicle
-- ORDER BY s.display_name;

-- ========================================
-- 9. XEM CHI TIẾT VEHICLES TẠI MỖI STATION
-- ========================================
-- SELECT 
--     s.display_name as station_name,
--     c."displayName" as car_name,
--     c.sku as car_sku,
--     sv.vehicle_id,
--     sv.status,
--     sv.battery_soc,
--     sv.note,
--     sv.created_at
-- FROM stations s
-- LEFT JOIN station_vehicles sv ON s.station_id = sv.station_id
-- LEFT JOIN "Car" c ON sv.vehicle_id = c.id
-- WHERE sv.vehicle_id IS NOT NULL
-- ORDER BY s.display_name, sv.created_at DESC;