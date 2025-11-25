-- =============================================
-- 0. CLEANUP & INIT (Tạo bảng nếu chưa có)
-- =============================================

-- Tạo ENUMs (Nếu chưa tồn tại)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('renter', 'staff', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tạo bảng USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone_number VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'renter',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    refreshtoken TEXT,
    station_id UUID
);

-- Tạo bảng RENTER_PROFILES
CREATE TABLE IF NOT EXISTS renter_profiles (
    id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    driver_license_url TEXT,
    national_id_url TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_by_staff_id UUID REFERENCES users(id),
    note TEXT,
    is_risky BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 1. SEED DATA
-- =============================================
INSERT INTO users (id, email, phone_number, password_hash, role, station_id, created_at, updated_at) VALUES
-- ADMIN
(
    '18e2d4a4-88f7-4c06-8cf6-6a3b7a97b0e1',
    'admin@system.com',
    '0900000001',
    '$2b$10$EpRnTzVlqHNP0.fKb.UvC.avXDsw8h8.5m/KX.B.sBNr.J7k/9n.6',
    'admin',
    NULL,
    NOW(), NOW()
),
-- STAFF (Hà Nội, TP.HCM, Đà Nẵng)
(
    '7c9bbf53-93cb-4b08-b530-8eb4fc0bcb8f',
    'staff.hanoi@station.com',
    '0910000001',
    '$2b$10$EpRnTzVlqHNP0.fKb.UvC.avXDsw8h8.5m/KX.B.sBNr.J7k/9n.6',
    'staff',
    '650e8400-e29b-41d4-a716-446655440001',
    NOW(), NOW()
),
(
    'c2efbcd1-56ac-4a62-9913-b07b4b1c44c3',
    'staff.hcm@station.com',
    '0910000002',
    '$2b$10$EpRnTzVlqHNP0.fKb.UvC.avXDsw8h8.5m/KX.B.sBNr.J7k/9n.6',
    'staff',
    '650e8400-e29b-41d4-a716-446655440002',
    NOW(), NOW()
),
(
    'd8a4c1b5-73ee-4218-8321-f6323f145288',
    'staff.danang@station.com',
    '0910000003',
    '$2b$10$EpRnTzVlqHNP0.fKb.UvC.avXDsw8h8.5m/KX.B.sBNr.J7k/9n.6',
    'staff',
    '650e8400-e29b-41d4-a716-446655440003',
    NOW(), NOW()
),
-- RENTER
(
    'f0d4c479-02bb-4ee1-a2c4-6a95ffb06664',
    'nguyen.van.a@gmail.com',
    '0988888888',
    '$2b$10$EpRnTzVlqHNP0.fKb.UvC.avXDsw8h8.5m/KX.B.sBNr.J7k/9n.6',
    'renter',
    NULL,
    NOW(), NOW()
)
ON CONFLICT (email) DO NOTHING;


INSERT INTO renter_profiles (id, full_name, verification_status, verified_by_staff_id, is_risky, note, created_at, updated_at) VALUES
(
    '18e2d4a4-88f7-4c06-8cf6-6a3b7a97b0e1',
    'Admin System',
    'verified',
    NULL,
    FALSE,
    'System Administrator',
    NOW(), NOW()
),
(
    '7c9bbf53-93cb-4b08-b530-8eb4fc0bcb8f',
    'Staff Hanoi',
    'verified',
    '18e2d4a4-88f7-4c06-8cf6-6a3b7a97b0e1',
    FALSE,
    'Staff member for Hanoi region',
    NOW(), NOW()
),
(
    'c2efbcd1-56ac-4a62-9913-b07b4b1c44c3',
    'Staff Hcm',
    'verified',
    '18e2d4a4-88f7-4c06-8cf6-6a3b7a97b0e1',
    FALSE,
    'Staff member for HCMC region',
    NOW(), NOW()
),
(
    'd8a4c1b5-73ee-4218-8321-f6323f145288',
    'Staff Danang',
    'verified',
    '18e2d4a4-88f7-4c06-8cf6-6a3b7a97b0e1',
    FALSE,
    'Staff member for Da Nang region',
    NOW(), NOW()
),
(
    'f0d4c479-02bb-4ee1-a2c4-6a95ffb06664',
    'Nguyen Van A',
    'verified',
    '7c9bbf53-93cb-4b08-b530-8eb4fc0bcb8f',
    FALSE,
    'Documents looked good. Approved.',
    NOW(), NOW()
)
ON CONFLICT (id) DO NOTHING;
