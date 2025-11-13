
-- ========================================
-- Ga Hà Nội
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440001'::uuid, '06571fb8-7dea-4cf3-8000-3836ecb86d4a'::uuid, 'available', 100, 'Xe mới, pin đầy'),
('650e8400-e29b-41d4-a716-446655440001'::uuid, '52cf8208-26ec-4a71-a1bc-ae921c80b129'::uuid, 'available', 95, 'Xe tốt'),
('650e8400-e29b-41d4-a716-446655440001'::uuid, '42d22335-a2a3-41ae-acef-11137547e604'::uuid, 'available', 90, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Hà Nội 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440006'::uuid, '06571fb8-7dea-4cf3-8000-3836ecb86d4a'::uuid, 'available', 100, 'Xe mới'),
('650e8400-e29b-41d4-a716-446655440006'::uuid, '47d41209-0396-4c73-bbaa-a2cc6b5d13a2'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Hà Nội 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440007'::uuid, '52cf8208-26ec-4a71-a1bc-ae921c80b129'::uuid, 'available', 95, NULL),
('650e8400-e29b-41d4-a716-446655440007'::uuid, '4f193e24-0bba-4dda-ac1d-58db2424c235'::uuid, 'available', 80, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Hà Nội 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440008'::uuid, '42d22335-a2a3-41ae-acef-11137547e604'::uuid, 'available', 90, NULL),
('650e8400-e29b-41d4-a716-446655440008'::uuid, '67bd90cd-cb18-4186-8afa-b610a51d5f76'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 3. THÊM VEHICLES VÀO TP.HCM (4 trạm)
-- ========================================
-- Ga TP.HCM
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440002'::uuid, '33dc24ef-4f4c-40f8-918e-87bab926bb1a'::uuid, 'available', 100, 'Xe cao cấp'),
('650e8400-e29b-41d4-a716-446655440002'::uuid, '65ccd1c9-351e-466b-8bcd-c40cf613e0d5'::uuid, 'available', 95, 'Xe tốt'),
('650e8400-e29b-41d4-a716-446655440002'::uuid, '7872e827-5c7d-4a8b-a4c4-119bb7090121'::uuid, 'available', 90, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga TP.HCM 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440009'::uuid, '33dc24ef-4f4c-40f8-918e-87bab926bb1a'::uuid, 'available', 100, NULL),
('650e8400-e29b-41d4-a716-446655440009'::uuid, '52cf8208-26ec-4a71-a1bc-ae921c80b129'::uuid, 'available', 95, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga TP.HCM 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440010'::uuid, '65ccd1c9-351e-466b-8bcd-c40cf613e0d5'::uuid, 'available', 100, NULL),
('650e8400-e29b-41d4-a716-446655440010'::uuid, '42d22335-a2a3-41ae-acef-11137547e604'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga TP.HCM 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440011'::uuid, '47d41209-0396-4c73-bbaa-a2cc6b5d13a2'::uuid, 'available', 90, NULL),
('650e8400-e29b-41d4-a716-446655440011'::uuid, '4f193e24-0bba-4dda-ac1d-58db2424c235'::uuid, 'available', 80, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 4. THÊM VEHICLES VÀO ĐÀ NẴNG (4 trạm)
-- ========================================
-- Ga Đà Nẵng
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440003'::uuid, '06571fb8-7dea-4cf3-8000-3836ecb86d4a'::uuid, 'available', 100, 'Xe sẵn sàng'),
('650e8400-e29b-41d4-a716-446655440003'::uuid, '52cf8208-26ec-4a71-a1bc-ae921c80b129'::uuid, 'available', 95, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Đà Nẵng 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440012'::uuid, '42d22335-a2a3-41ae-acef-11137547e604'::uuid, 'available', 90, NULL),
('650e8400-e29b-41d4-a716-446655440012'::uuid, '47d41209-0396-4c73-bbaa-a2cc6b5d13a2'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Đà Nẵng 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440013'::uuid, '4f193e24-0bba-4dda-ac1d-58db2424c235'::uuid, 'available', 80, NULL),
('650e8400-e29b-41d4-a716-446655440013'::uuid, '67bd90cd-cb18-4186-8afa-b610a51d5f76'::uuid, 'available', 75, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Đà Nẵng 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440014'::uuid, '896d5168-082d-4bc5-ae05-4eda3600c52a'::uuid, 'available', 90, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 5. THÊM VEHICLES VÀO NHA TRANG (4 trạm)
-- ========================================
-- Ga Nha Trang
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440004'::uuid, '06571fb8-7dea-4cf3-8000-3836ecb86d4a'::uuid, 'available', 100, 'Xe mới'),
('650e8400-e29b-41d4-a716-446655440004'::uuid, '52cf8208-26ec-4a71-a1bc-ae921c80b129'::uuid, 'available', 95, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Nha Trang 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440015'::uuid, '42d22335-a2a3-41ae-acef-11137547e604'::uuid, 'available', 90, NULL),
('650e8400-e29b-41d4-a716-446655440015'::uuid, '47d41209-0396-4c73-bbaa-a2cc6b5d13a2'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Nha Trang 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440016'::uuid, '4f193e24-0bba-4dda-ac1d-58db2424c235'::uuid, 'available', 80, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Nha Trang 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440017'::uuid, '67bd90cd-cb18-4186-8afa-b610a51d5f76'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 6. THÊM VEHICLES VÀO HUẾ (4 trạm)
-- ========================================
-- Ga Huế
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440005'::uuid, '52cf8208-26ec-4a71-a1bc-ae921c80b129'::uuid, 'available', 95, NULL),
('650e8400-e29b-41d4-a716-446655440005'::uuid, '42d22335-a2a3-41ae-acef-11137547e604'::uuid, 'available', 90, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Huế 2
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440018'::uuid, '47d41209-0396-4c73-bbaa-a2cc6b5d13a2'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Huế 3
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440019'::uuid, '4f193e24-0bba-4dda-ac1d-58db2424c235'::uuid, 'available', 80, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- Ga Huế 4
INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note) VALUES
('650e8400-e29b-41d4-a716-446655440020'::uuid, '67bd90cd-cb18-4186-8afa-b610a51d5f76'::uuid, 'available', 85, NULL)
ON CONFLICT (station_id, vehicle_id) DO NOTHING;

-- ========================================
-- 7. UPDATE count_vehicle CHO TẤT CẢ STATIONS
-- ========================================
UPDATE stations 
SET count_vehicle = (
    SELECT COUNT(*) 
    FROM station_vehicles 
    WHERE station_vehicles.station_id = stations.station_id
);

-- ========================================
-- 8. XEM KẾT QUẢ
-- ========================================
SELECT 
    s.station_id,
    s.user_id,
    s.display_name,
    s.address,
    s.count_vehicle,
    COUNT(sv.vehicle_id) as total_vehicles,
    COUNT(CASE WHEN sv.status = 'available' THEN 1 END) as available_vehicles,
    COUNT(CASE WHEN sv.status = 'rented' THEN 1 END) as rented_vehicles,
    COUNT(CASE WHEN sv.status = 'maintenance' THEN 1 END) as maintenance_vehicles
FROM stations s
LEFT JOIN station_vehicles sv ON s.station_id = sv.station_id
GROUP BY s.station_id, s.user_id, s.display_name, s.address, s.count_vehicle
ORDER BY s.display_name;

-- ========================================
-- 9. XEM CHI TIẾT VEHICLES TẠI MỖI STATION
-- ========================================
SELECT 
    s.display_name as station_name,
    sv.vehicle_id,
    sv.status,
    sv.battery_soc,
    sv.note,
    sv.created_at
FROM stations s
LEFT JOIN station_vehicles sv ON s.station_id = sv.station_id
WHERE sv.vehicle_id IS NOT NULL
ORDER BY s.display_name, sv.created_at DESC;

