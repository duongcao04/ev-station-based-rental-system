import pool from "../config/db.js";
import { BookingModel } from "../models/BookingModel.js";

// POST /v1/api/bookings
export const createBooking = async (req, res) => {
  try {
    const { vehicle_id, start_date, end_date, total_amount, calculated_price_details } = req.body;
    const user_id = req.user.id; // Lấy từ authenticated user

    if (!vehicle_id || !start_date || !end_date || !total_amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await BookingModel.create({
      user_id, vehicle_id, start_date, end_date, total_amount, calculated_price_details,
    });
    res.status(201).json(booking);
  } catch (e) {
 
    if (e.code && e.code.startsWith("23")) {
      return res.status(409).json({ error: "Vehicle time overlap or constraint violation" });
    }

    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /v1/api/bookings/:id/checkin
export const checkin = async (req, res) => {
  try {
    const booking = await BookingModel.checkin({ booking_id: req.params.id });
    if (!booking) return res.status(400).json({ error: "Invalid state or booking not found" });
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

    const { actual_return_date, final_amount } = req.body;

    console.log('Return request:', { id, actual_return_date, final_amount });

    if (!actual_return_date) {
      return res.status(400).json({ error: "actual_return_date is required" });
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

    await client.query("BEGIN");
    const updated = await BookingModel.returnVehicle(client, {
      booking_id: id,
      actual_return_date,
      final_amount: final_amount || current.total_amount,
    });
    await client.query("COMMIT");

    console.log('Return successful:', updated);
    res.json({ booking: updated });
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
// PUT /v1/api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id; // Lấy từ authenticated user

    const booking = await BookingModel.getById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status !== "booked") {
      return res.status(400).json({ error: "Only booked bookings can be cancelled" });
    }

    // Renter chỉ có thể hủy booking của mình
    if (req.user.role === 'renter' && booking.user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized to cancel this booking" });
    }

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

