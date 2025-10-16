import pool from "../config/db.js";

export const BookingModel = {
  create: async ({ renter_id, vehicle_id, start_station_id, start_time, expected_end_time, estimated_cost }) => {
    const q = `
      INSERT INTO rentals
      (renter_id, vehicle_id, start_station_id, start_time, expected_end_time, status, estimated_cost)
      VALUES ($1,$2,$3,$4,$5,'booked',$6)
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [
      renter_id, vehicle_id, start_station_id, start_time, expected_end_time, estimated_cost ?? null,
    ]);
    return rows[0];
  },

  checkin: async ({ id, staff_id }) => {
    const q = `
      UPDATE rentals
      SET status='ongoing', check_in_staff_id=$2
      WHERE id=$1 AND status='booked'
      RETURNING *;
    `;
    const { rows } = await pool.query(q, [id, staff_id]);
    return rows[0] || null;
  },

  // Chạy trong controller (đã có transaction client)
  returnVehicle: async (client, { id, end_time, end_station_id, actual_cost, staff_id, notes }) => {
    const q = `
      UPDATE rentals
      SET status='completed',
          end_time=$2,
          end_station_id=COALESCE($3, end_station_id),
          actual_cost=$4,
          check_out_staff_id=$5,
          check_out_notes=COALESCE($6, check_out_notes)
      WHERE id=$1 AND status='ongoing'
      RETURNING *;
    `;
    const { rows } = await client.query(q, [
      id, end_time, end_station_id ?? null, actual_cost ?? null, staff_id, notes ?? null,
    ]);
    return rows[0] || null;
  },

  getVehiclePricing: async (vehicle_id) => {
    const { rows } = await pool.query(`SELECT price_per_hour FROM vehicles WHERE id=$1`, [vehicle_id]);
    return rows[0] || null;
  },

  getById: async (id) => {
    const { rows } = await pool.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    return rows[0] || null;
  },

  listMine: async (renter_id) => {
    const { rows } = await pool.query(
      `SELECT r.*, s.name AS start_station_name, s2.name AS end_station_name
       FROM rentals r
       LEFT JOIN stations s  ON r.start_station_id = s.id
       LEFT JOIN stations s2 ON r.end_station_id = s2.id
       WHERE r.renter_id=$1
       ORDER BY r.start_time DESC`,
      [renter_id]
    );
    return rows;
  },
};
