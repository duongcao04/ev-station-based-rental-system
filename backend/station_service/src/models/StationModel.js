import pool from "../config/db.js";

export const StationModel = {
    listAll: async () => {
        const { rows } = await pool.query("SELECT * FROM stations ORDER BY created_at DESC");
        return rows;
    },

    getByUserId: async (user_id) => {
        const { rows } = await pool.query("SELECT * FROM stations WHERE user_id=$1", [user_id]);
        return rows[0] || null;
    },

    upsert: async ({ user_id, display_name, address, latitude, longitude, count_vehicle }) => {
        const q = `
      INSERT INTO stations (user_id, display_name, address, latitude, longitude, count_vehicle)
      VALUES ($1, $2, $3, $4, $5, COALESCE($6, 0))
      ON CONFLICT (user_id)
      DO UPDATE SET display_name=EXCLUDED.display_name,
                    address=EXCLUDED.address,
                    latitude=EXCLUDED.latitude,
                    longitude=EXCLUDED.longitude,
                    count_vehicle=EXCLUDED.count_vehicle,
                    updated_at=NOW()
      RETURNING *;
    `;
        const { rows } = await pool.query(q, [user_id, display_name, address, latitude || null, longitude || null, count_vehicle || 0]);
        return rows[0];
    },

    update: async (user_id, { display_name, address, latitude, longitude, count_vehicle }) => {
        const { rows } = await pool.query(
            `UPDATE stations
       SET display_name=COALESCE($2, display_name),
           address=COALESCE($3, address),
           latitude=COALESCE($4, latitude),
           longitude=COALESCE($5, longitude),
           count_vehicle=COALESCE($6, count_vehicle),
           updated_at=NOW()
       WHERE user_id=$1
       RETURNING *`,
            [user_id, display_name || null, address || null, latitude || null, longitude || null, count_vehicle]
        );
        return rows[0] || null;
    },

    listVehicles: async (user_id) => {
        const { rows } = await pool.query(
            "SELECT * FROM station_vehicles WHERE user_id=$1 ORDER BY created_at DESC",
            [user_id]
        );
        return rows;
    },

    addVehicle: async (user_id, vehicle_id) => {
        const q = `
      INSERT INTO station_vehicles (user_id, vehicle_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, vehicle_id) DO NOTHING
      RETURNING *;
    `;
        const result = await pool.query(q, [user_id, vehicle_id]);
        return result.rows[0] || null;
    },

    removeVehicle: async (user_id, vehicle_id) => {
        const { rowCount } = await pool.query(
            "DELETE FROM station_vehicles WHERE user_id=$1 AND vehicle_id=$2",
            [user_id, vehicle_id]
        );
        return rowCount > 0;
    },
};


