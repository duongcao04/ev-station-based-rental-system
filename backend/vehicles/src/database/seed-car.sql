-- Clear tables in dependency order
TRUNCATE TABLE "Car" RESTART IDENTITY CASCADE;

-- ───────────────────────────────────────────────
-- Car
-- ───────────────────────────────────────────────
INSERT INTO "Car" (
    id, "regularPrice", "salePrice", "depositPrice", quantity, "isInStock",
    description, "thumbnailUrl", "brandId", "displayName", sku, slug, status, "seatingCapacity"
) VALUES
('1a2b3c4d-0001-4e7f-a123-000000000001', 50000.00, 48000.00, 5000.00, 10, true, 'Xe điện nhỏ gọn, tiết kiệm năng lượng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQX7EL3fLZcWdBdVRfcTXsW2o2OFklPTRN7Hg&s', 'a7b9c1d2-34c5-4fab-b8c7-8de45e310007', 'Tesla Model 3', 'TESLA-M3', 'tesla-model-3', 'available', 5),
('1a2b3c4d-0002-4e7f-a123-000000000002', 75000.00, 72000.00, 7000.00, 5, true, 'Xe SUV điện hiệu suất cao', 'https://res.cloudinary.com/unix-center/image/upload/c_limit,dpr_3.0,f_auto,fl_progressive,g_center,h_240,q_auto:good,w_385/inno5xbcnmct5gl4xdgn.jpg', 'a7b9c1d2-34c5-4fab-b8c7-8de45e310007', 'Tesla Model X', 'TESLA-MX', 'tesla-model-x', 'available', 7),
('1a2b3c4d-0003-4e7f-a123-000000000003', 35000.00, 34000.00, 3000.00, 12, true, 'Xe điện nhỏ gọn, tiện dụng trong thành phố', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSPmljGPdGKzhImF674Szi6uGiN04VS-CaOw&s', 'b8c1d2e3-45d6-4e1d-a2e4-7cf56f310008', 'Hyundai Kona EV', 'HYU-KONA', 'hyundai-kona-ev', 'available', 5),
('1a2b3c4d-0004-4e7f-a123-000000000004', 40000.00, 38000.00, 4000.00, 8, true, 'Xe điện hatchback hiện đại', 'https://bonbanh.com/news/images/oto/Kia/ev6/2024/kia-ev6-2024.jpg', 'c9d2e3f4-56e7-4f2e-b3a1-6df67a310009', 'Kia EV6', 'KIA-EV6', 'kia-ev6', 'available', 5),
('1a2b3c4d-0005-4e7f-a123-000000000005', 60000.00, 58000.00, 6000.00, 6, true, 'Xe điện sang trọng, tiết kiệm năng lượng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJB3fvz79rJBO1lbhvqXBSdQLAp68cJA_r5g&s', 'd4e6f7a8-98c2-4eb8-8a91-2bcdfc310004', 'BMW i4', 'BMW-I4', 'bmw-i4', 'available', 5),
('1a2b3c4d-0006-4e7f-a123-000000000006', 80000.00, 78000.00, 8000.00, 3, true, 'SUV điện sang trọng', 'https://www.peugeotthanhxuan.vn/wp-content/uploads/2024/11/Danh-gia-xe-bmw-ix-2025-Dep-sang-thoi-thuong.png', 'd4e6f7a8-98c2-4eb8-8a91-2bcdfc310004', 'BMW iX', 'BMW-IX', 'bmw-ix', 'available', 5),
('1a2b3c4d-0007-4e7f-a123-000000000007', 90000.00, 88000.00, 9000.00, 2, true, 'Xe điện sang trọng hiệu suất cao', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRld0Oa06V6kmCAsPoSmIhaQUslSJSnLVFEnw&s', 'f6a8b9c1-23b4-4e9a-b1ac-4bc35d310006', 'Mercedes EQS', 'MB-EQS', 'mercedes-eqs', 'available', 5),
('1a2b3c4d-0008-4e7f-a123-000000000008', 70000.00, 68000.00, 7000.00, 4, true, 'SUV điện tiện nghi', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm82WQiNaGAJXOpjnP96NSvbrF7AdQK8QQ0A&s', 'f6a8b9c1-23b4-4e9a-b1ac-4bc35d310006', 'Mercedes EQC', 'MB-EQC', 'mercedes-eqc', 'available', 5),
('1a2b3c4d-0009-4e7f-a123-000000000009', 45000.00, 43000.00, 4000.00, 9, true, 'Xe điện nhỏ gọn và hiện đại', 'https://www.winauto.vn/wp-content/uploads/2024/08/chi-tiet-xe-volkswagen-id-3-2024-co-gi-canh-tranh-voi-vinfast-vf-e34.jpg', 'a4b6c7d8-90cb-4e6c-f7d5-2c0abe310013', 'Volkswagen ID.3', 'VW-ID3', 'volkswagen-id3', 'available', 5),
('1a2b3c4d-0010-4e7f-a123-000000000010', 50000.00, 48000.00, 5000.00, 7, true, 'Xe điện tiện nghi gia đình', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_3nHJOIE_1LfMABnKdZPeskxWIrhLx2vi4g&s', 'a4b6c7d8-90cb-4e6c-f7d5-2c0abe310013', 'Volkswagen ID.4', 'VW-ID4', 'volkswagen-id4', 'available', 5),
('1a2b3c4d-0011-4e7f-a123-000000000011', 120000.00, 115000.00, 10000.00, 1, true, 'Xe thể thao điện cao cấp', 'https://i1-vnexpress.vnecdn.net/2024/10/18/Porsche-Taycan-Vnexpress-net-11-JPG.jpg?w=2400&h=0&q=100&dpr=1&fit=crop&s=LoskMEDqKHzXgrHyeWd5Ag&t=image', 'c6d8e9f1-b2ed-408e-19f7-0e2cdf310015', 'Porsche Taycan', 'POR-TAYCAN', 'porsche-taycan', 'available', 4),
('1a2b3c4d-0012-4e7f-a123-000000000012', 55000.00, 53000.00, 5000.00, 6, true, 'Xe điện hatchback sang trọng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTV8_AMgawXf983a5Lw9GObTCeKxcHhj7gXjA&s', 'c9d2e3f4-56e7-4f2e-b3a1-6df67a310009', 'Kia Niro EV', 'KIA-NIRO', 'kia-niro-ev', 'available', 5),
('1a2b3c4d-0013-4e7f-a123-000000000013', 62000.00, 60000.00, 6000.00, 3, true, 'SUV điện sang trọng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcotUw7pJLX65LCCY6o3uCXOfeQ4lxvmvkgg&s', 'b8c1d2e3-45d6-4e1d-a2e4-7cf56f310008', 'Hyundai Ioniq 5', 'HYU-IONIQ5', 'hyundai-ioniq5', 'available', 5),
('1a2b3c4d-0014-4e7f-a123-000000000014', 48000.00, 46000.00, 4000.00, 8, true, 'Xe điện tiện dụng', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDsP3S0UX3kHkZM0QRNGqohwg84EvSNQFUGw&s', 'a7b9c1d2-34c5-4fab-b8c7-8de45e310007', 'Tesla Model Y', 'TESLA-MY', 'tesla-model-y', 'available', 5),
('1a2b3c4d-0015-4e7f-a123-000000000015', 75000.00, 72000.00, 7000.00, 4, true, 'Xe điện SUV hiệu suất cao', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiHLZ58ODCW73uFsDI2-YfgmU3vlzPc8KCnA&s', 'd4e6f7a8-98c2-4eb8-8a91-2bcdfc310004', 'BMW iX3', 'BMW-IX3', 'bmw-ix3', 'available', 5),
('1a2b3c4d-0016-4e7f-a123-000000000016', 58000.00, 55000.00, 5000.00, 5, true, 'Xe điện gia đình', 'https://giaxeoto.vn/admin/upload/images/chi-tiet-volkswagen-id5-2022-kem-gia-ban-112021-1636444469.jpg', 'a4b6c7d8-90cb-4e6c-f7d5-2c0abe310013', 'Volkswagen ID.5', 'VW-ID5', 'volkswagen-id5', 'available', 5),
('1a2b3c4d-0017-4e7f-a123-000000000017', 47000.00, 45000.00, 4000.00, 6, true, 'Xe điện nhỏ gọn', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjKz9tCUxSKAF37YR-XROFSLzteJevFfQAuQ&s', 'c9d2e3f4-56e7-4f2e-b3a1-6df67a310009', 'Kia Soul EV', 'KIA-SOUL', 'kia-soul-ev', 'available', 5),
('1a2b3c4d-0018-4e7f-a123-000000000018', 105000.00, 100000.00, 9000.00, 2, true, 'Xe điện sang trọng thể thao', 'https://hips.hearstapps.com/hmg-prod/images/2020-porsche-taycan-4s-106-1576001334.jpg?crop=0.479xw:0.783xh;0.200xw,0.165xh&resize=1200:*', 'c6d8e9f1-b2ed-408e-19f7-0e2cdf310015', 'Porsche Taycan 4S', 'POR-TAYCAN4S', 'porsche-taycan-4s', 'available', 4),
('1a2b3c4d-0019-4e7f-a123-000000000019', 65000.00, 62000.00, 6000.00, 3, true, 'SUV điện hiện đại', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwupTe10VIm377JZ_mU3up7RWUvy-A_93U4w&s', 'b8c1d2e3-45d6-4e1d-a2e4-7cf56f310008', 'Hyundai Ioniq 6', 'HYU-IONIQ6', 'hyundai-ioniq6', 'available', 5),
('1a2b3c4d-0020-4e7f-a123-000000000020', 53000.00, 50000.00, 5000.00, 7, true, 'Xe điện hatchback', 'https://hips.hearstapps.com/hmg-prod/images/2025-tesla-model-s-1-672d42e172407.jpg?crop=0.465xw:0.466xh;0.285xw,0.361xh&resize=2048:*', 'a7b9c1d2-34c5-4fab-b8c7-8de45e310007', 'Tesla Model S', 'TESLA-MS', 'tesla-model-s', 'available', 5)
ON CONFLICT (id) DO UPDATE
SET 
    "regularPrice" = EXCLUDED."regularPrice",
    "salePrice" = EXCLUDED."salePrice",
    "depositPrice" = EXCLUDED."depositPrice",
    quantity = EXCLUDED.quantity,
    "isInStock" = EXCLUDED."isInStock",
    description = EXCLUDED.description,
    "thumbnailUrl" = EXCLUDED."thumbnailUrl",
    "brandId" = EXCLUDED."brandId",
    "displayName" = EXCLUDED."displayName",
    sku = EXCLUDED.sku,
    slug = EXCLUDED.slug,
    status = EXCLUDED.status,
    "seatingCapacity" = EXCLUDED."seatingCapacity";

