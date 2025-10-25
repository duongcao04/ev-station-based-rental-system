import pool from "../config/db.js";

export const BookingModel = {
  create: async ({ user_id, vehicle_id, start_date, end_date, total_amount, calculated_price_details }) => {
    const q = `
      INSERT INTO bookings
      (user_id, vehicle_id, start_date, end_date, total_amount, calculated_price_details, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'booked')
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [
      user_id, vehicle_id, start_date, end_date, total_amount, calculated_price_details,
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
  returnVehicle: async (client, { booking_id, actual_return_date, final_amount }) => {
    const q = `
      UPDATE bookings
      SET status='completed',
          actual_return_date=$2,
          total_amount=$3
      WHERE booking_id=$1 AND status='ongoing'
      RETURNING *;
    `;
    const { rows } = await client.query(q, [
      booking_id, actual_return_date, final_amount,
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

};
