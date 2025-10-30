
import { PaymentModel } from "../models/PaymentModel.js";
import axios from "axios";


// Post v1/api/payments

export const createPayment = async (req, res) => {
  const { booking_id, amount, type, payment_method, provider, description } = req.body;
  const user_id = req.user?.id;

  // validation
  if (!booking_id || !amount || !type) {
    return res.status(400).json({
      error: "Missing required fields"
    })
  }

  // Validate amount is positive number
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "amount must be a positive number" });
  }

  // Validate type
  const allowedTypes = ['rental_fee', 'deposit', 'extra_fee', 'refund'];
  if (!allowedTypes.includes(type)) {
    return res.status(400).json({
      error: "Invalid type",
      allowed: allowedTypes
    });
  }

  // Validate payment_method (if provided)
  if (payment_method) {
    const allowedMethods = ['credit_card', 'e_wallet', 'bank_transfer', 'cash'];
    if (!allowedMethods.includes(payment_method)) {
      return res.status(400).json({
        error: "Invalid payment_method",
        allowed: allowedMethods
      });
    }
  }

  // Create payment
  return PaymentModel.create({
    booking_id,
    user_id,
    amount,
    type,
    payment_method,
    provider,
    description,
  })
    .then((payment) => {
      return res.status(201).json({
        message: "Payment created successfully",
        payment,
      });
    })
    .catch((err) => {
      console.error("createPayment error:", err);

      // Handle unique constraint violations
      if (err.code === '23505') {
        return res.status(409).json({
          error: "Payment already exists for this booking and type",
          detail: err.detail
        });
      }

      return res.status(500).json({ error: "Internal server error" });
    });

}

// GET /v1/api/payments/:id
export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentModel.getById(id);
    if (!payment) return res.status(404).json({ error: "Payment not found" });

    // renters can only view their own payments
    if (req.user?.role === 'renter' && payment.user_id != req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    return res.json({ payment });
  } catch (err) {
    console.error("getPaymentById error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// GET /v1/api/payments/user/:user_id
export const getPaymentsByUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { status, limit, offset } = req.query;

    const payments = await PaymentModel.getByUserId(Number(user_id), {
      status,
      limit: Number(limit) || 50,
      offset: Number(offset) || 0,
    });
    return res.json({ payments });
  } catch (err) {
    console.error("getPaymentsByUser error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// PUT /v1/api/payments/:id/status
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, failure_reason } = req.body;

    const allowedStatuses = ['init', 'pending', 'succeeded', 'failed', 'refunded'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const timestamps = {};
    const now = new Date();
    if (['pending', 'succeeded', 'failed', 'refunded'].includes(status)) {
      timestamps.processed_at = now;
    }
    if (['succeeded', 'refunded'].includes(status)) {
      timestamps.completed_at = now;
    }

    const updated = await PaymentModel.updateStatus(id, status, {
      failure_reason: failure_reason || null,
      ...timestamps,
    });
    if (!updated) return res.status(404).json({ error: 'Payment not found' });
    return res.json({ payment: updated });
  } catch (err) {
    console.error('updatePaymentStatus error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /v1/api/payments/:id/refund
export const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const exists = await PaymentModel.getById(id);
    if (!exists) return res.status(404).json({ error: 'Payment not found' });

    if (exists.status === 'refunded') {
      return res.status(400).json({ error: 'Already refunded' });
    }

    const refunded = await PaymentModel.refund(id, { reason });
    return res.json({ payment: refunded });
  } catch (err) {
    console.error('refundPayment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// POST /v1/api/payments/:id/cash/confirm
export const confirmCashPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await PaymentModel.getById(id);
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    if (payment.payment_method !== 'cash') {
      return res.status(400).json({ error: 'Only cash payments can be confirmed via this endpoint' });
    }
    if (payment.status === 'succeeded') {
      return res.status(400).json({ error: 'Payment already succeeded' });
    }
    if (payment.status === 'refunded') {
      return res.status(400).json({ error: 'Payment already refunded' });
    }

    const now = new Date();
    const updated = await PaymentModel.updateStatus(id, 'succeeded', {
      processed_at: now,
      completed_at: now,
    });

    // Đồng bộ payment_id với Booking Service
    try {
      const baseUrl = process.env.BOOKING_SERVICE_URL || 'http://localhost:4000/v1/api';
      await axios.put(
        `${baseUrl}/bookings/${payment.booking_id}/payment`,
        { payment_id: id },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': req.headers['x-user-id'] || '',
          },
          timeout: 5000,
        }
      );
    } catch (syncErr) {
      console.error('Booking sync failed:', syncErr?.response?.data || syncErr.message);
      // Do not fail the confirmation if sync fails; client can retry sync later
    }

    return res.json({ payment: updated });
  } catch (err) {
    console.error('confirmCashPayment error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
