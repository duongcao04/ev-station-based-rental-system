import pool from "../config/db.js";
import { BookingModel } from "../models/BookingModel.js";

// POST /v1/api/bookings
export const createBooking = async (req, res) => {
  try {
    const { vehicle_id, payment_id, start_station_id, end_station_id, start_date, end_date, total_amount, calculated_price_details } = req.body;
    const user_id = req.user?.id;

    console.log('📝 Create booking request:', {
      user_id,
      vehicle_id,
      start_station_id,
      end_station_id,
      start_date,
      end_date,
      total_amount,
      has_calculated_price_details: !!calculated_price_details
    });

    // Allow creating booking without payment_id; it can be attached later
    if (!vehicle_id || !start_station_id || !end_station_id || !start_date || !end_date || !total_amount) {
      return res.status(400).json({
        error: "Missing required fields",
        missing: {
          vehicle_id: !vehicle_id,
          start_station_id: !start_station_id,
          end_station_id: !end_station_id,
          start_date: !start_date,
          end_date: !end_date,
          total_amount: !total_amount
        }
      });
    }

    // Validate total_amount is positive number
    const totalAmountNum = Number(total_amount);
    if (isNaN(totalAmountNum) || totalAmountNum <= 0) {
      return res.status(400).json({ error: "total_amount must be a positive number", received: total_amount });
    }

    // Validate date format
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: "Invalid date format", start_date, end_date });
    }

    // Validate start_date < end_date (cho phép cùng ngày nhưng end_date phải sau start_date về thời gian)
    if (startDate >= endDate) {
      return res.status(400).json({
        error: "end_date must be after start_date",
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        message: "End date must be at least 1 second after start date"
      });
    }

    const booking = await BookingModel.create({
      user_id,
      vehicle_id,
      payment_id,
      start_station_id,
      end_station_id,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      total_amount: totalAmountNum,
      calculated_price_details: calculated_price_details || null,
    });

    console.log(' Booking created successfully:', booking.booking_id);
    res.status(201).json(booking);
  } catch (e) {
    console.error(' Create booking error:', e);

    if (e.code && e.code.startsWith("23")) {
      return res.status(409).json({ error: "Vehicle time overlap or constraint violation", details: e.message });
    }

    // Database constraint errors
    if (e.code === '23503') {
      return res.status(400).json({ error: "Invalid reference (vehicle_id, station_id, etc.)", details: e.message });
    }

    res.status(500).json({ error: "Server error", details: e.message, code: e.code });
  }
};

// PUT /v1/api/bookings/:id/checkin
export const checkin = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra booking có tồn tại không
    const existingBooking = await BookingModel.getById(id);
    if (!existingBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Kiểm tra trạng thái booking
    if (existingBooking.status !== 'booked') {
      return res.status(400).json({
        error: "Booking cannot be checked in",
        current_status: existingBooking.status,
        required_status: "booked"
      });
    }

    const booking = await BookingModel.checkin({ booking_id: id });
    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /v1/api/bookings/:id/return
export const returnVehicle = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;

    // Debug: Log request body
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    // Check if req.body exists
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing. Please send JSON data." });
    }

    const { actual_return_date, actual_return_station_id, penalty_fee } = req.body;

    console.log('Return request:', { id, actual_return_date, actual_return_station_id, penalty_fee });

    if (!actual_return_date) {
      return res.status(400).json({ error: "actual_return_date is required" });
    }

    if (!actual_return_station_id) {
      return res.status(400).json({ error: "actual_return_station_id is required" });
    }

    // Validate penalty_fee
    if (penalty_fee !== undefined && (isNaN(penalty_fee) || penalty_fee < 0)) {
      return res.status(400).json({ error: "penalty_fee must be a non-negative number" });
    }

    // booking hiện tại
    const current = await BookingModel.getById(id);
    console.log('Current booking:', current);

    if (!current) {
      return res.status(404).json({ error: "Booking not found" });
    }

    if (current.status !== "ongoing") {
      return res.status(400).json({ error: "Booking must be ongoing to return" });
    }

    // ========== TÍNH TOÁN REFUND DEPOSIT ==========

    // Phí phát sinh (Staff nhập thủ công)
    const totalPenalty = Number(penalty_fee) || 0;

    // Lấy deposit amount từ calculated_price_details nếu có
    const depositAmount = current.calculated_price_details?.deposit || current.deposit_amount || 0;

    // Tính refund amount
    let refundAmount = 0;
    let finalAmount = current.total_amount;

    if (depositAmount > 0) {
      if (totalPenalty === 0) {
        // Không có phí phát sinh → hoàn full deposit
        refundAmount = depositAmount;
      } else if (totalPenalty < depositAmount) {
        // Phí phát sinh < cọc → hoàn cọc trừ phí
        refundAmount = depositAmount - totalPenalty;
      } else {
        // Phí phát sinh >= cọc → không hoàn, có thể phải thanh toán thêm
        refundAmount = 0;
        const additionalFee = totalPenalty - depositAmount;
        finalAmount = current.total_amount + additionalFee;
      }
    }

    await client.query("BEGIN");
    const updated = await BookingModel.returnVehicle(client, {
      booking_id: id,
      actual_return_date,
      actual_return_station_id,
      final_amount: finalAmount,
      late_fee: totalPenalty,
      refund_amount: refundAmount,
    });
    await client.query("COMMIT");

    console.log('Return successful:', updated);
    res.json({
      booking: updated,
      breakdown: {
        deposit_amount: depositAmount,
        penalty_fee: totalPenalty,
        refund_amount: refundAmount,
        final_amount: finalAmount,
        additional_payment_required: totalPenalty > depositAmount ? totalPenalty - depositAmount : 0
      }
    });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error('Return error:', e);
    res.status(500).json({ error: "Server error", details: e.message });
  } finally {
    client.release();
  }
};

// GET /v1/api/bookings/:id
export const getBooking = async (req, res) => {
  try {
    const booking = await BookingModel.getById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json(booking);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /v1/api/bookings/me - Renter xem booking của mình
export const myBookings = async (req, res) => {
  try {
    const user_id = req.user.id; // Lấy từ authenticated user
    const data = await BookingModel.listMine(user_id);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /v1/api/bookings/all - Staff/Admin xem tất cả bookings
export const getAllBookings = async (req, res) => {
  try {
    const { status, station_id, limit = 50, offset = 0 } = req.query;

    let query = 'SELECT * FROM bookings';
    const params = [];
    const conditions = [];

    if (status) {
      conditions.push(`status = $${params.length + 1}`);
      params.push(status);
    }

    if (station_id) {
      conditions.push(`(start_station_id = $${params.length + 1} OR end_station_id = $${params.length + 1})`);
      params.push(station_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), parseInt(offset));

    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
// PUT /v1/api/bookings/:id/payment
export const updateBookingPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_id } = req.body;
    if (!payment_id) return res.status(400).json({ error: "payment_id is required" });

    const existing = await BookingModel.getById(id);
    if (!existing) return res.status(404).json({ error: "Booking not found" });

    const updated = await BookingModel.updatePaymentId({ booking_id: id, payment_id });
    return res.json({ booking: updated });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
// PUT /v1/api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await BookingModel.getById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status !== "booked") {
      return res.status(400).json({ error: "Only booked bookings can be cancelled" });
    }

    // Ownership đã được kiểm tra bởi middleware checkOwnership
    const cancelled = await BookingModel.cancel(id);
    if (!cancelled) {
      return res.status(400).json({ error: "Cancel failed (state changed or not booked)" });
    }

    return res.json({ message: "Booking cancelled successfully", booking: cancelled });
  } catch (e) {
    console.error("cancelBooking error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

