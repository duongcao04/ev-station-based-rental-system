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

    addVehicle: async (user_id, vehicle_id, { status, battery_soc, note } = {}) => {
        const q = `
      INSERT INTO station_vehicles (user_id, vehicle_id, status, battery_soc, note)
      VALUES ($1, $2, COALESCE($3, 'available'), COALESCE($4, 100), $5)
      ON CONFLICT (user_id, vehicle_id) DO NOTHING
      RETURNING *;
    `;
        const result = await pool.query(q, [
            user_id,
            vehicle_id,
            status || 'available',
            battery_soc || 100,
            note || null
        ]);
        return result.rows[0] || null;
    },

    removeVehicle: async (user_id, vehicle_id) => {
        const { rowCount } = await pool.query(
            "DELETE FROM station_vehicles WHERE user_id=$1 AND vehicle_id=$2",
            [user_id, vehicle_id]
        );
        return rowCount > 0;
    },

    // Update vehicle status trong station
    updateVehicleStatus: async (user_id, vehicle_id, updates = {}) => {
        const { status, battery_soc, note } = updates;
        const updatesArray = [];
        const params = [user_id, vehicle_id];
        let paramIndex = 3;

        if (status !== undefined) {
            updatesArray.push(`status = $${paramIndex++}`);
            params.push(status);
        }
        if (battery_soc !== undefined) {
            updatesArray.push(`battery_soc = $${paramIndex++}`);
            params.push(battery_soc);
        }
        if (note !== undefined) {
            updatesArray.push(`note = $${paramIndex++}`);
            params.push(note);
        }

        if (updatesArray.length === 0) {
            // Không có gì để update, trả về record hiện tại
            const { rows } = await pool.query(
                "SELECT * FROM station_vehicles WHERE user_id=$1 AND vehicle_id=$2",
                [user_id, vehicle_id]
            );
            return rows[0] || null;
        }

        updatesArray.push(`updated_at = NOW()`);
        const q = `
            UPDATE station_vehicles
            SET ${updatesArray.join(', ')}
            WHERE user_id=$1 AND vehicle_id=$2
            RETURNING *;
        `;
        const { rows } = await pool.query(q, params);
        return rows[0] || null;
    },

    // Lấy stations chứa vehicle (query ngược)
    getStationsByVehicleId: async (vehicle_id) => {
        const { rows } = await pool.query(
            `SELECT s.* FROM stations s
             INNER JOIN station_vehicles sv ON s.user_id = sv.user_id
             WHERE sv.vehicle_id=$1
             ORDER BY s.created_at DESC`,
            [vehicle_id]
        );
        return rows;
    },

    // Update count_vehicle cho station
    updateVehicleCount: async (user_id) => {
        const { rows } = await pool.query(
            `UPDATE stations
             SET count_vehicle=(SELECT COUNT(*) FROM station_vehicles WHERE user_id=$1),
                 updated_at=NOW()
             WHERE user_id=$1
             RETURNING *`,
            [user_id]
        );
        return rows[0] || null;
    },
};


