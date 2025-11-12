
INSERT INTO stations (user_id, display_name, address, latitude, longitude, count_vehicle) VALUES
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Ga Hà Nội',
    'Số 1 Lê Duẩn, Hoàn Kiếm, Hà Nội',
    '21.0285',
    '105.8542',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'Ga TP.HCM',
    'Số 1 Nguyễn Thông, Quận 3, TP.HCM',
    '10.7769',
    '106.7009',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Ga Đà Nẵng',
    'Số 1 Hải Phòng, Hải Châu, Đà Nẵng',
    '16.0544',
    '108.2022',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'Ga Nha Trang',
    'Số 1 Trần Phú, Nha Trang, Khánh Hòa',
    '12.2388',
    '109.1967',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    'Ga Huế',
    'Số 1 Lê Lợi, Thành phố Huế, Thừa Thiên Huế',
    '16.4637',
    '107.5909',
    0
)
ON CONFLICT (user_id) DO NOTHING;

-- Hiển thị kết quả
SELECT 
    user_id,
    display_name,
    address,
    count_vehicle,
    created_at
FROM stations
ORDER BY created_at DESC;

