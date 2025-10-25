# Booking Service - Microservice Database Setup

## 🗄️ Database Setup

### 1. Tạo Database mới
```bash
# Kết nối vào PostgreSQL
psql -U postgres

# Tạo database mới
CREATE DATABASE booking_service_db;

# Tạo user cho booking service
CREATE USER booking_user WITH PASSWORD 'booking_password';
GRANT ALL PRIVILEGES ON DATABASE booking_service_db TO booking_user;

# Thoát khỏi psql
\q
```

### 2. Chạy Migration
```bash
# Cách 1: Sử dụng script migration
npm run migrate

# Cách 2: Chạy SQL trực tiếp
psql -U booking_user -d booking_service_db -f database/init.sql

# Cách 3: Reset database (xóa và tạo lại)
npm run db:reset
```

### 3. Cấu hình Environment
Tạo file `.env`:
```env
# Database Configuration
DB_USER=booking_user
DB_HOST=localhost
DB_DATABASE=booking_service_db
DB_PASSWORD=booking_password
DB_PORT=5432

# Application Configuration
PORT=3000
NODE_ENV=development
```

## 🚀 Chạy Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## 🧪 Test API

### Chạy test script
```bash
npm test
```

### Manual testing với curl
```bash
# Tạo booking
curl -X POST http://localhost:3000/v1/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1001,
    "vehicle_id": "550e8400-e29b-41d4-a716-446655440001",
    "start_date": "2024-01-20T09:00:00+07:00",
    "end_date": "2024-01-20T17:00:00+07:00",
    "total_amount": 400.00,
    "calculated_price_details": {
      "pricing_type": "daily",
      "price_per_day": 50.00,
      "duration_days": 8,
      "base_cost": 400.00
    }
  }'

# Lấy booking theo ID
curl http://localhost:3000/v1/api/bookings/{booking_id}

# Check-in xe
curl -X PUT http://localhost:3000/v1/api/bookings/{booking_id}/checkin

# Trả xe
curl -X PUT http://localhost:3000/v1/api/bookings/{booking_id}/return \
  -H "Content-Type: application/json" \
  -d '{
    "actual_return_date": "2024-01-20T18:00:00+07:00",
    "final_amount": 450.00
  }'

# Lấy danh sách booking của user
curl "http://localhost:3000/v1/api/bookings/me?user_id=1001"
```

## 📊 Database Schema

### Bảng chính: `bookings`
- `booking_id` (UUID, Primary Key)
- `user_id` (INTEGER, Foreign Reference)
- `vehicle_id` (UUID, Foreign Reference)
- `start_date` (TIMESTAMP WITH TIME ZONE)
- `end_date` (TIMESTAMP WITH TIME ZONE)
- `actual_return_date` (TIMESTAMP WITH TIME ZONE, nullable)
- `total_amount` (NUMERIC(12,2))
- `calculated_price_details` (JSONB)
- `status` (VARCHAR(50))
- `created_at` (TIMESTAMP WITH TIME ZONE)

### Status Flow
```
booked → ongoing → completed
   ↓
cancelled
```

## 🔧 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/api/bookings` | Tạo booking mới |
| GET | `/v1/api/bookings/:id` | Lấy thông tin booking |
| GET | `/v1/api/bookings/me?user_id=...` | Lịch sử booking của user |
| PUT | `/v1/api/bookings/:id/checkin` | Check-in xe |
| PUT | `/v1/api/bookings/:id/return` | Trả xe |
| PUT | `/v1/api/bookings/:id/cancel` | Hủy booking |

## 🛡️ Validation

- **User ID**: Phải là số nguyên dương
- **Vehicle ID**: Phải là UUID hợp lệ
- **Dates**: End date phải sau start date
- **Total Amount**: Phải là số không âm
- **Price Details**: JSONB với cấu trúc hợp lệ
- **Status**: Chỉ cho phép transitions hợp lệ

## 🚨 Troubleshooting

### Database connection issues
```bash
# Kiểm tra kết nối database
psql -U booking_user -d booking_service_db -c "SELECT 1;"
```

### Port conflicts
```bash
# Kiểm tra port đang sử dụng
netstat -tulpn | grep :3000
```

### Permission issues
```bash
# Cấp quyền cho user
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE booking_service_db TO booking_user;"
```
