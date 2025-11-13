
INSERT INTO stations (user_id, display_name, address, latitude, longitude, count_vehicle) VALUES
-- Hà Nội (4 trạm)
(
    '550e8400-e29b-41d4-a716-446655440001'::uuid,
    'Ga Hà Nội',
    'Số 1 Lê Duẩn, Hoàn Kiếm, Hà Nội',
    '21.0285',
    '105.8542',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440006'::uuid,
    'Ga Hà Nội 2',
    'Số 120 Trần Phú, Ba Đình, Hà Nội',
    '21.0385',
    '105.8342',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440007'::uuid,
    'Ga Hà Nội 3',
    'Số 50 Nguyễn Chí Thanh, Đống Đa, Hà Nội',
    '21.0185',
    '105.8142',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440008'::uuid,
    'Ga Hà Nội 4',
    'Số 200 Láng Hạ, Đống Đa, Hà Nội',
    '21.0085',
    '105.7942',
    0
),
-- TP.HCM (4 trạm)
(
    '550e8400-e29b-41d4-a716-446655440002'::uuid,
    'Ga TP.HCM',
    'Số 1 Nguyễn Thông, Quận 3, TP.HCM',
    '10.7769',
    '106.7009',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440009'::uuid,
    'Ga TP.HCM 2',
    'Số 100 Nguyễn Văn Cừ, Quận 5, TP.HCM',
    '10.7569',
    '106.6809',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440010'::uuid,
    'Ga TP.HCM 3',
    'Số 50 Lê Lợi, Quận 1, TP.HCM',
    '10.7769',
    '106.7209',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440011'::uuid,
    'Ga TP.HCM 4',
    'Số 200 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    '10.7969',
    '106.7109',
    0
),
-- Đà Nẵng (4 trạm)
(
    '550e8400-e29b-41d4-a716-446655440003'::uuid,
    'Ga Đà Nẵng',
    'Số 1 Hải Phòng, Hải Châu, Đà Nẵng',
    '16.0544',
    '108.2022',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440012'::uuid,
    'Ga Đà Nẵng 2',
    'Số 100 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',
    '16.0744',
    '108.2222',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440013'::uuid,
    'Ga Đà Nẵng 3',
    'Số 50 Trần Phú, Hải Châu, Đà Nẵng',
    '16.0444',
    '108.1922',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440014'::uuid,
    'Ga Đà Nẵng 4',
    'Số 200 Lê Duẩn, Hải Châu, Đà Nẵng',
    '16.0344',
    '108.1822',
    0
),
-- Nha Trang (4 trạm)
(
    '550e8400-e29b-41d4-a716-446655440004'::uuid,
    'Ga Nha Trang',
    'Số 1 Trần Phú, Nha Trang, Khánh Hòa',
    '12.2388',
    '109.1967',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440015'::uuid,
    'Ga Nha Trang 2',
    'Số 100 Yersin, Nha Trang, Khánh Hòa',
    '12.2588',
    '109.2167',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440016'::uuid,
    'Ga Nha Trang 3',
    'Số 50 Trần Hưng Đạo, Nha Trang, Khánh Hòa',
    '12.2188',
    '109.1767',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440017'::uuid,
    'Ga Nha Trang 4',
    'Số 200 Nguyễn Trãi, Nha Trang, Khánh Hòa',
    '12.2288',
    '109.1867',
    0
),
-- Huế (4 trạm)
(
    '550e8400-e29b-41d4-a716-446655440005'::uuid,
    'Ga Huế',
    'Số 1 Lê Lợi, Thành phố Huế, Thừa Thiên Huế',
    '16.4637',
    '107.5909',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440018'::uuid,
    'Ga Huế 2',
    'Số 100 Hùng Vương, Thành phố Huế, Thừa Thiên Huế',
    '16.4837',
    '107.6109',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440019'::uuid,
    'Ga Huế 3',
    'Số 50 Bà Triệu, Thành phố Huế, Thừa Thiên Huế',
    '16.4437',
    '107.5709',
    0
),
(
    '550e8400-e29b-41d4-a716-446655440020'::uuid,
    'Ga Huế 4',
    'Số 200 Trần Hưng Đạo, Thành phố Huế, Thừa Thiên Huế',
    '16.4537',
    '107.5809',
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

