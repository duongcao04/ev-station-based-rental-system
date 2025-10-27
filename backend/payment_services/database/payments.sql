CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS payments (
  payment_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id     UUID        NOT NULL,                          
  user_id        INTEGER     NOT NULL,
  type           VARCHAR(20) NOT NULL DEFAULT 'rental_fee',      
  status         VARCHAR(20) NOT NULL DEFAULT 'init',            
  amount         NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency       VARCHAR(10)  NOT NULL DEFAULT 'VND',
  payment_method VARCHAR(50),
  provider       VARCHAR(30),                                    
  provider_ref   VARCHAR(255),                                   
  provider_meta  JSONB,                                         
  description    TEXT,
  failure_reason TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at   TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ
);
-- Thêm ràng buộc logic cho processed_at
ALTER TABLE payments
  ADD CONSTRAINT chk_processed_at
  CHECK (
    (status IN ('pending','succeeded','failed','refunded') AND processed_at IS NOT NULL)
    OR
    (status = 'init' AND processed_at IS NULL)
  );
-- Trạng thái hợp lệ
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS chk_payment_status;
ALTER TABLE payments
  ADD  CONSTRAINT chk_payment_status
  CHECK (status IN ('init','pending','succeeded','failed','refunded'));

-- Loại thanh toán hợp lệ
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS chk_payment_type;
ALTER TABLE payments
  ADD  CONSTRAINT chk_payment_type
  CHECK (type IN ('rental_fee','deposit','extra_fee','refund'));

-- Phương thức thanh toán (tuỳ nghiệp vụ: có thể bỏ CHECK nếu muốn linh hoạt)
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS chk_payment_method;
ALTER TABLE payments
  ADD  CONSTRAINT chk_payment_method
  CHECK (
    payment_method IS NULL
    OR payment_method IN ('credit_card','e_wallet','bank_transfer','cash')
  );

-- Currency (đơn giản hoá nếu chỉ dùng VND)
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS chk_currency;
ALTER TABLE payments
  ADD  CONSTRAINT chk_currency
  CHECK (currency IN ('VND','USD','EUR'));

-- Ràng buộc logic thời gian theo trạng thái
ALTER TABLE payments
  DROP CONSTRAINT IF EXISTS chk_payment_times;
ALTER TABLE payments
  ADD  CONSTRAINT chk_payment_times
  CHECK (
    (status IN ('succeeded','refunded') AND completed_at IS NOT NULL)
    OR
    (status IN ('init','pending','failed') AND completed_at IS NULL)
  );

-- ---------- Triggers (updated_at) ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ---------- Uniqueness & de-dup ----------
-- 1) Chống ghi trùng callback từ provider
CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_provider_ref
  ON payments(provider, provider_ref)
  WHERE provider IS NOT NULL AND provider_ref IS NOT NULL;

-- 2) Mỗi booking chỉ có 1 rental_fee & 1 deposit (tuỳ nghiệp vụ)
CREATE UNIQUE INDEX IF NOT EXISTS ux_payments_booking_type_unique
  ON payments(booking_id, type)
  WHERE type IN ('rental_fee','deposit');

-- ---------- Indexes for common access patterns ----------
CREATE INDEX IF NOT EXISTS idx_payments_booking_id   ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id      ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status       ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_type         ON payments(type);
CREATE INDEX IF NOT EXISTS idx_payments_created_at   ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_booking_stat ON payments(booking_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_user_status  ON payments(user_id, status);

-- ---------- Outbox & Idempotency (khuyến nghị nếu dùng event-driven) ----------
CREATE TABLE IF NOT EXISTS outbox (
  id         BIGSERIAL PRIMARY KEY,
  topic      TEXT     NOT NULL,
  payload    JSONB    NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sent       BOOLEAN  NOT NULL DEFAULT FALSE
);
CREATE INDEX IF NOT EXISTS idx_outbox_sent_created ON outbox(sent, created_at);

CREATE TABLE IF NOT EXISTS processed_events (
  event_id   TEXT PRIMARY KEY,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Thêm indexes cần thiết cho outbox
CREATE INDEX IF NOT EXISTS idx_outbox_topic ON outbox(topic);
CREATE INDEX IF NOT EXISTS idx_outbox_created_at ON outbox(created_at);
CREATE INDEX IF NOT EXISTS idx_outbox_topic_sent ON outbox(topic, sent);
-- =============================================
-- OPTIONAL: Sample data for local testing
-- (Comment out in production)
-- =============================================
-- INSERT INTO payments (booking_id, user_id, amount, type, status, payment_method, provider, provider_ref, description)
-- VALUES
-- ('550e8400-e29b-41d4-a716-446655440001', 1001, 400.00, 'rental_fee', 'succeeded', 'e_wallet', 'momo',   'momo_123456789',   'Thanh toán phí thuê xe điện'),
-- ('550e8400-e29b-41d4-a716-446655440002', 1002, 200.00, 'rental_fee', 'pending',   'credit_card', 'stripe','stripe_987654321', 'Thanh toán phí thuê xe điện'),
-- ('550e8400-e29b-41d4-a716-446655440003', 1003, 100.00, 'rental_fee', 'failed',    'bank_transfer','vnpay','vnpay_456789123',  'Thanh toán phí thuê xe điện');

-- UPDATE payments
--   SET processed_at = created_at + INTERVAL '5 minutes',
--       completed_at = created_at + INTERVAL '10 minutes'
-- WHERE status = 'succeeded';
-- UPDATE payments
--   SET processed_at = created_at + INTERVAL '2 minutes'
-- WHERE status = 'pending';
-- UPDATE payments
--   SET processed_at = created_at + INTERVAL '3 minutes',
--       failure_reason = 'Insufficient funds'
-- WHERE status = 'failed';
