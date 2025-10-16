import pool from "../config/db.js";
import { BookingModel } from "../models/booking.model.js";
import { calcCost } from "../services/pricing.service.js";

// POST /v1/api/bookings
export const createBooking = async (req, res) => {
  try {
    const { renter_id, vehicle_id, start_station_id, start_time, expected_end_time, estimated_cost } = req.body;
    if (!renter_id || !vehicle_id || !start_station_id || !start_time || !expected_end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await BookingModel.create({
      renter_id, vehicle_id, start_station_id, start_time, expected_end_time, estimated_cost,
    });
    res.status(201).json(booking);
  } catch (e) {
    // Lỗi EXCLUDE overlap/constraint có code 23xxx
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
    const rental = await BookingModel.checkin({ id: req.params.id, staff_id: req.body.staff_id });
    if (!rental) return res.status(400).json({ error: "Invalid state or rental not found" });
    res.json(rental);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /v1/api/bookings/:id/return   (KHÔNG tạo payment; chỉ tính tiền & update)
export const returnVehicle = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { end_time, end_station_id, staff_id, note } = req.body;
    if (!end_time) return res.status(400).json({ error: "end_time is required" });

    // rental hiện tại
    const current = await BookingModel.getById(id);
    if (!current || current.status !== "ongoing") {
      client.release();
      return res.status(400).json({ error: "Invalid state or rental not found" });
    }

    // tính tiền theo vehicles.price_per_hour
    const pricing = await BookingModel.getVehiclePricing(current.vehicle_id);
    const actual_cost = calcCost({
      start_time: current.start_time,
      end_time,
      price_per_hour: pricing?.price_per_hour || 0,
    });

    await client.query("BEGIN");
    const updated = await BookingModel.returnVehicle(client, {
      id, end_time, end_station_id, actual_cost, staff_id, notes: note,
    });
    await client.query("COMMIT");

    res.json({ rental: updated });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// GET /v1/api/bookings/:id
export const getBooking = async (req, res) => {
  try {
    const rental = await BookingModel.getById(req.params.id);
    if (!rental) return res.status(404).json({ error: "Not found" });
    res.json(rental);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /v1/api/bookings/me?renter_id=...
export const myBookings = async (req, res) => {
  try {
    const { renter_id } = req.query;
    if (!renter_id) return res.status(400).json({ error: "Missing renter_id" });
    const data = await BookingModel.listMine(renter_id);
    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
};
