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
| POST | `/v1/api/payments/vnpay` | Tạo payment VNPay |
| POST | `/v1/api/payments/momo` | Tạo payment MoMo |
| GET | `/v1/api/payments/vnpay/return` | Callback VNPay |
| GET | `/v1/api/payments/momo/return` | Callback MoMo |
| POST | `/v1/api/payments/momo/notify` | IPN callback MoMo |
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

## Environment Variables

Bạn cần thêm các biến môi trường sau vào file `.env`:

### VNPay Configuration
```
VNPAY_TMN_CODE=your_vnpay_tmn_code
VNPAY_SECURE_SECRET=your_vnpay_secret_key
VNPAY_HOST=https://sandbox.vnpayment.vn
VNPAY_RETURN_URL=http://localhost:3001/api/v1/payments/vnpay/return
VNPAY_HASH_ALGORITHM=SHA512
VNPAY_TEST_MODE=true
```

### MoMo Configuration
```
MOMO_PARTNER_CODE=your_momo_partner_code  # Lấy từ: MoMo Business > Trung tâm thanh toán > Tích hợp thanh toán > Thông tin tích hợp
MOMO_ACCESS_KEY=your_momo_access_key       # Lấy từ: MoMo Business > Trung tâm thanh toán > Tích hợp thanh toán > Thông tin tích hợp
MOMO_SECRET_KEY=your_momo_secret_key       # Lấy từ: MoMo Business > Trung tâm thanh toán > Tích hợp thanh toán > Thông tin tích hợp
MOMO_RETURN_URL=http://localhost:5000/api/v1/payments/momo/return
MOMO_NOTIFY_URL=http://localhost:5000/api/v1/payments/momo/notify
```

**Lưu ý**: Các trường `partnerName` và `storeId` đã có giá trị mặc định trong code nên không cần khai báo trong `.env`. Nếu cần thay đổi, bạn có thể thêm:
```
MOMO_PARTNER_NAME=Your Company Name  # Mặc định: Test
MOMO_STORE_ID=your_store_id          # Mặc định: MomoTestStore
```

### Database Configuration
```
DB_USER=payment_user
DB_HOST=localhost
DB_DATABASE=payment_service_db
DB_PASSWORD=payment_password
DB_PORT=5432
```

### Other Configuration
```
PORT=5000
NODE_ENV=development
PAYMENT_RETURN_URL=http://localhost:5173
```
