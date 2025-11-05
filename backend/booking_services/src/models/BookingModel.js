import pool from "../config/db.js";

export const BookingModel = {
  create: async ({ user_id, vehicle_id, payment_id, start_station_id, end_station_id, start_date, end_date, total_amount, calculated_price_details }) => {
    const depositAmount = calculated_price_details?.deposit || null;

    const q = `
      INSERT INTO bookings
      (user_id, vehicle_id, payment_id, start_station_id, end_station_id, start_date, end_date, total_amount, calculated_price_details, deposit_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'booked')
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [
      user_id, vehicle_id, payment_id || null, start_station_id, end_station_id, start_date, end_date, total_amount, calculated_price_details, depositAmount,
    ]);
    return rows[0];
  },

  checkin: async ({ booking_id }) => {
    const q = `
      UPDATE bookings
      SET status='ongoing'
      WHERE booking_id=$1 AND status='booked'
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [booking_id]);
    return rows[0] || null;
  },

  // Chạy trong controller (đã có transaction client)
  returnVehicle: async (client, { booking_id, actual_return_date, actual_return_station_id, final_amount, late_fee, refund_amount }) => {
    const q = `
      UPDATE bookings
      SET status='completed',
          actual_return_date=$2,
          actual_return_station_id=$3,
          total_amount=$4,
          late_fee=$5,
          refund_amount=$6
      WHERE booking_id=$1 AND status='ongoing'
      RETURNING *;
    `;
    const { rows } = await client.query(q, [
      booking_id, actual_return_date, actual_return_station_id, final_amount, late_fee, refund_amount,
    ]);
    return rows[0] || null;
  },

  getById: async (booking_id) => {
    const { rows } = await pool.query(`SELECT * FROM bookings WHERE booking_id=$1`, [booking_id]);
    return rows[0] || null;
  },

  listMine: async (user_id) => {
    const { rows } = await pool.query(
      `SELECT * FROM bookings 
       WHERE user_id=$1
       ORDER BY created_at DESC`,
      [user_id]
    );
    return rows;
  },

  cancel: async (booking_id) => {
    const q = `
      UPDATE bookings
      SET status = 'cancelled'
      WHERE booking_id = $1 AND status = 'booked'
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [booking_id]);
    return rows[0] || null;
  },

  updatePaymentId: async ({ booking_id, payment_id }) => {
    const q = `
      UPDATE bookings
      SET payment_id = $2
      WHERE booking_id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [booking_id, payment_id]);
    return rows[0] || null;
  },

};
