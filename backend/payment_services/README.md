# Payment Services

## Cài đặt

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Setup database
```bash
# Tạo database
psql -U postgres -c "CREATE DATABASE payment_service_db;"
psql -U postgres -c "CREATE USER payment_user WITH PASSWORD 'payment_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE payment_service_db TO payment_user;"

# Chạy migration
npm run migrate
```

### 3. Cấu hình environment
```bash
cp env.example .env
# Chỉnh sửa file .env theo cấu hình của bạn
```

## Chạy ứng dụng

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/v1/api/payments` | Tạo payment |
| GET | `/v1/api/payments/:id` | Lấy payment theo ID |
| GET | `/v1/api/payments/user/:user_id` | Lịch sử payment của user |
| PUT | `/v1/api/payments/:id/status` | Cập nhật trạng thái |
| POST | `/v1/api/payments/:id/refund` | Hoàn tiền |

## Test API

```bash
# Tạo payment
curl -X POST http://localhost:3001/v1/api/payments \
  -H "Content-Type: application/json" \
  -H "x-user-id: 1001" \
  -d '{
    "booking_id": "550e8400-e29b-41d4-a716-446655440001",
    "amount": 400.00,
    "type": "rental_fee",
    "payment_method": "e_wallet",
    "provider": "momo"
  }'
```

## Database

Bảng chính: `payments`
- `payment_id` - ID thanh toán
- `booking_id` - ID đặt xe
- `user_id` - ID người dùng
- `amount` - Số tiền
- `status` - Trạng thái (init, pending, succeeded, failed, refunded)
- `type` - Loại thanh toán (rental_fee, deposit, extra_fee, refund)
- `provider` - Nhà cung cấp (momo, zalopay, vnpay)
- `created_at` - Thời gian tạo
