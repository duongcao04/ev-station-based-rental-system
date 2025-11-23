-- Clear tables in dependency order
TRUNCATE TABLE "Brand", "Category", "SpecificationType" RESTART IDENTITY CASCADE;

-- ───────────────────────────────────────────────
-- SpecificationType
-- ───────────────────────────────────────────────
INSERT INTO "SpecificationType" (id, "label", "icon", "description") VALUES
('8d2a4fd0-9b86-4e3f-9bcb-0a2e4d1fa111', 'Công suất động cơ', 'engine.svg', 'Công suất cực đại của động cơ điện (kW hoặc HP)'),
('a0c1a5f5-4db2-4bcc-bf2a-5b0cd163e8bb', 'Dung lượng pin', 'battery.svg', 'Dung lượng pin (kWh)'),
('6f2fc345-5d37-4e93-a09f-06baf026863b', 'Tầm hoạt động', 'range.svg', 'Quãng đường đi được cho 1 lần sạc đầy (km)'),
('c8d9c8dc-0909-43e5-8fa3-7a410cda2c49', 'Thời gian sạc', 'plug.svg', 'Thời gian sạc từ 0–80% hoặc 0–100%'),
('1bdcfb70-f6fc-4b16-8f04-7305a731ece2', 'Hộp số', 'gear.svg', 'Xe điện thường không có hộp số hoặc 1 cấp'),
('f7bb0ab5-31db-4f92-9826-332708449b5a', 'Mô-men xoắn', 'torque.svg', 'Mô-men xoắn cực đại của motor (Nm)'),
('5dd45593-9b2d-4e0d-a38e-3eebc73fdb7d', 'Tăng tốc', 'speedometer.svg', 'Thời gian tăng tốc 0–100 km/h'),
('3ebc7cdb-aa16-4e04-9180-d34a8c39fd41', 'Tốc độ tối đa', 'speed.svg', 'Tốc độ tối đa đạt được'),
('2c0fa5c4-7f9b-4fbd-8126-30c4b98a4d09', 'Trọng lượng', 'weight.svg', 'Khối lượng xe, bao gồm pin'),
('e1b5b4d4-1748-4f8e-83e2-46cd6db6e189', 'Dạng dẫn động', 'drive.svg', 'FWD, RWD, AWD'),
('a486d0d0-8a05-4f87-ae1a-572c8db91a20', 'Số chỗ ngồi', 'seat.svg', 'Sức chứa hành khách'),
('b9d9da79-92cd-45b6-9fb2-bb705e6a5af9', 'Màu sắc', 'color.svg', 'Tùy chọn màu ngoại thất'),
('92f12480-6440-4a80-89e1-7a9bfa39b63d', 'Hệ thống an toàn', 'star.svg', 'Xếp hạng an toàn NCAP hoặc tương đương'),
('ab4671a9-1dd8-4547-b381-55fd3bc64336', 'Hệ thống hỗ trợ lái', 'assist.svg', 'ADAS, tự lái, hỗ trợ đỗ xe…'),
('c770bec0-f1b0-4a47-8f58-05b6832b3da0', 'Bảo hành pin', 'shield.svg', 'Thời gian và điều kiện bảo hành pin')
ON CONFLICT (id) DO UPDATE
SET
    "label" = EXCLUDED."label",
    "icon" = EXCLUDED."icon",
    "description" = EXCLUDED."description";

-- ───────────────────────────────────────────────
-- Category
-- ───────────────────────────────────────────────
INSERT INTO "Category" (id, "displayName", "description", "thumbnailUrl") VALUES
('f1c2b0b8-1e7c-43fe-8e5b-0c4a8a9b0a01', 'SUV', 'Xe thể thao đa dụng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYF3EtatSgGOivafFN4p9HSrSKBkAhrVlWAQ&s'),
('b5f7a7f4-3168-4b6f-b637-5063cbfcd402', 'Sedan', 'Xe du lịch 4–5 chỗ tiện nghi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRC6XrrPeI7s1Xm2SGAxH7vkJaf2pAf_HvLAQ&s'),
('f7c98ad6-24bd-4e87-8b3c-8a156e2ff403', 'Hatchback', 'Xe nhỏ gọn, linh hoạt', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrrXND3fTs5avovyLVT85Hyq1tM9C1Dk-NkQ&s'),
('9b3b7b15-3876-4c54-8488-1d3ef2dd5f04', 'Coupe', 'Xe thể thao 2 cửa phong cách', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZTuDdv3MmHYbTKZjle_6NJY_6tA4sJmyJYw&s'),
('3c9dcffc-92a9-4ab2-a993-7f34f9d61305', 'Convertible', 'Xe mui trần', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcfy5fBmRK3s36iFr9y64n5G9QeJvMmZzu4w&s'),
('8f7ce554-fa57-4bb4-baa1-dc7f4ed7d206', 'Pickup Truck', 'Xe bán tải chở hàng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoiPsit555xHvGpUWUh5_EMvZacyIxklaacw&s'),
('72b8e9f1-c214-4bd2-baf0-304889d58f07', 'Van', 'Xe chở gia đình hoặc hàng hóa', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOPKdWw5V3-8D8KmclsDcju6lBo5ERvppfWA&s'),
('5b1e6bf1-643d-4b47-aa91-c4e3c5f38908', 'Crossover', 'Kết hợp giữa SUV và sedan', 'https://utourvietnam.vn/wp-content/uploads/2024/09/xe-crossover-1.jpg'),
('6c7aa92b-22f7-4c21-90e1-c2b3af510909', 'Luxury', 'Xe sang cao cấp', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCbfwXfXoiGhigpU1fYHoanPBwqAddzLpLFg&s'),
('a17ae003-88f0-4b0e-8d8a-2c1a1ffc1a10', 'Sports Car', 'Xe thể thao hiệu suất cao', 'https://www.usnews.com/object/image/00000191-d821-d8b8-adf7-f97944b10000/chevrolet-corvette-zr1-coupe-001.jpg?update-time=1725907944302&size=responsiveGallery&format=webp'),
('39de9012-e5bc-495b-a00e-13bd0c3f3211', 'Electric', 'Xe điện chạy pin', 'https://images.squarespace-cdn.com/content/v1/6151d38ea56f9d31cf76ec07/61189f51-55c5-4a76-a708-c73c3e1bcf88/What+does+EV+demand+currently+look+like%3F+-+The+Electric+Car+Scheme'),
('91cd21dd-b4e4-4a13-824d-ae75e3d61212', 'Hybrid', 'Xe hybrid (xăng + điện)', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvqobVaasfIL4S3ua6b5W1r86aTpZxyp1W-g&s'),
('c9ef8f0a-12ee-4990-a4ff-ae07f9145514', 'Compact', 'Xe nhỏ tiết kiệm nhiên liệu', 'https://vinfastbinhthuan.com.vn/wp-content/uploads/2024/07/vinfastbinhthuan-com-vn-jPmXJPI0T2.jpg'),
('7deed018-98f1-40af-afeb-3052dcdc1c15', 'Minivan', 'Xe gia đình nhiều chỗ', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBblGIe5O9uNeA8tp2xWlHE1FbLnKNlNY4gg&s')
ON CONFLICT (id) DO UPDATE
SET 
    "displayName" = EXCLUDED."displayName",
    "description" = EXCLUDED."description",
    "thumbnailUrl" = EXCLUDED."thumbnailUrl";

-- ───────────────────────────────────────────────
-- Brand
-- ───────────────────────────────────────────────
INSERT INTO "Brand" (id, "displayName", "description", "thumbnailUrl") VALUES
('a7b9c1d2-34c5-4fab-b8c7-8de45e310007', 'Tesla', 'Hãng xe tiên phong trong lĩnh vực xe điện', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3GYDIvxL-beJ8TFMwamtsRNTKncCUMcXNdA&s'),
('b8c1d2e3-45d6-4e1d-a2e4-7cf56f310008', 'Hyundai', 'Thương hiệu Hàn Quốc, nổi bật với dòng xe điện Ioniq, Kona EV', 'https://mondialbrand.com/wp-content/uploads/2023/12/Mau_thiet_-ke_-logo_thuong_-hieu_hyundai.jpeg'),
('c9d2e3f4-56e7-4f2e-b3a1-6df67a310009', 'Kia', 'Xe điện hiện đại như EV6 và Niro EV', 'https://icolor.vn/wp-content/uploads/2024/08/kia2.jpg'),
('e5f7a8b9-12a3-4d7d-8fb9-9ed23b310005', 'Audi', 'Dòng xe điện e-tron và Q4 e-tron', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTP0l072r4Npno0x19aKnI_RK27V7p37yXDFX-o_Hvcm1eIpz2TwsTZPOVvYAiF3L8rd8&usqp=CAU'),
('d4e6f7a8-98c2-4eb8-8a91-2bcdfc310004', 'BMW', 'Xe điện series i3, iX, i4', 'https://i.pinimg.com/736x/8b/b1/84/8bb184b137c8858d430b5e8555795f31.jpg'),
('f6a8b9c1-23b4-4e9a-b1ac-4bc35d310006', 'Mercedes-Benz', 'Dòng EQ (EQC, EQS) – xe điện sang trọng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Blmy5vxZ8ezAmmrVHQojgSEhGSouQ1eqeQ&s'),
('a4b6c7d8-90cb-4e6c-f7d5-2c0abe310013', 'Volkswagen', 'Dòng xe điện ID. series (ID.3, ID.4)', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5OUHcoeD6F8oplIzJU21lFgMhVlS7JCh0tA&s'),
('c6d8e9f1-b2ed-408e-19f7-0e2cdf310015', 'Porsche', 'Xe thể thao điện cao cấp Taycan', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbMjVyHHRG81YJYuwg-k5cFKeMpJOgGh8iHg&s')
ON CONFLICT (id) DO UPDATE
SET 
    "displayName" = EXCLUDED."displayName",
    "description" = EXCLUDED."description",
    "thumbnailUrl" = EXCLUDED."thumbnailUrl";

