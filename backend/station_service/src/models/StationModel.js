import pool from "../config/db.js";

export const StationModel = {
    listAll: async () => {
        const { rows } = await pool.query("SELECT * FROM stations ORDER BY created_at DESC");
        return rows;
    },

    getById: async (station_id) => {
        const { rows } = await pool.query("SELECT * FROM stations WHERE station_id=$1", [station_id]);
        return rows[0] || null;
    },

    getByUserId: async (user_id) => {
        const { rows } = await pool.query("SELECT * FROM stations WHERE user_id=$1", [user_id]);
        return rows[0] || null;
    },

    upsert: async ({ station_id, user_id, display_name, address, latitude, longitude, count_vehicle }) => {
        const q = `
            INSERT INTO stations (station_id, user_id, display_name, address, latitude, longitude, count_vehicle)
            VALUES (COALESCE($1, uuid_generate_v4()), $2, $3, $4, $5, $6, COALESCE($7, 0))
            ON CONFLICT (user_id)
            DO UPDATE SET display_name = EXCLUDED.display_name,
                          address = EXCLUDED.address,
                          latitude = EXCLUDED.latitude,
                          longitude = EXCLUDED.longitude,
                          count_vehicle = EXCLUDED.count_vehicle,
                          updated_at = NOW()
            RETURNING *;
        `;
        const { rows } = await pool.query(q, [
            station_id ?? null,
            user_id,
            display_name,
            address,
            latitude ?? null,
            longitude ?? null,
            count_vehicle ?? 0,
        ]);
        return rows[0] || null;
    },

    updateById: async (station_id, { display_name, address, latitude, longitude, count_vehicle }) => {
        const { rows } = await pool.query(
            `UPDATE stations
             SET display_name = COALESCE($2, display_name),
                 address = COALESCE($3, address),
                 latitude = COALESCE($4, latitude),
                 longitude = COALESCE($5, longitude),
                 count_vehicle = COALESCE($6, count_vehicle),
                 updated_at = NOW()
             WHERE station_id = $1
             RETURNING *`,
            [station_id, display_name ?? null, address ?? null, latitude ?? null, longitude ?? null, count_vehicle]
        );
        return rows[0] || null;
    },

    updateByUserId: async (user_id, updates) => {
        const station = await StationModel.getByUserId(user_id);
        if (!station) return null;
        return StationModel.updateById(station.station_id, updates);
    },

    listVehicles: async (station_id) => {
        const { rows } = await pool.query(
            "SELECT * FROM station_vehicles WHERE station_id=$1 ORDER BY created_at DESC",
            [station_id]
        );
        return rows;
    },

    addVehicle: async (station_id, vehicle_id, { status, battery_soc, note } = {}) => {
        const q = `
            INSERT INTO station_vehicles (station_id, vehicle_id, status, battery_soc, note)
            VALUES ($1, $2, COALESCE($3, 'available'), COALESCE($4, 100), $5)
            ON CONFLICT (station_id, vehicle_id) DO NOTHING
            RETURNING *;
        `;
        const result = await pool.query(q, [
            station_id,
            vehicle_id,
            status ?? 'available',
            battery_soc ?? 100,
            note ?? null,
        ]);
        return result.rows[0] || null;
    },

    removeVehicle: async (station_id, vehicle_id) => {
        const { rowCount } = await pool.query(
            "DELETE FROM station_vehicles WHERE station_id=$1 AND vehicle_id=$2",
            [station_id, vehicle_id]
        );
        return rowCount > 0;
    },

    updateVehicleStatus: async (station_id, vehicle_id, updates = {}) => {
        const { status, battery_soc, note } = updates;
        const updatesArray = [];
        const params = [station_id, vehicle_id];
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
            const { rows } = await pool.query(
                "SELECT * FROM station_vehicles WHERE station_id=$1 AND vehicle_id=$2",
                [station_id, vehicle_id]
            );
            return rows[0] || null;
        }

        updatesArray.push(`updated_at = NOW()`);
        const q = `
            UPDATE station_vehicles
            SET ${updatesArray.join(', ')}
            WHERE station_id=$1 AND vehicle_id=$2
            RETURNING *;
        `;
        const { rows } = await pool.query(q, params);
        return rows[0] || null;
    },

    getStationsByVehicleId: async (vehicle_id) => {
        const { rows } = await pool.query(
            `SELECT s.* FROM stations s
             INNER JOIN station_vehicles sv ON s.station_id = sv.station_id
             WHERE sv.vehicle_id=$1
             ORDER BY s.created_at DESC`,
            [vehicle_id]
        );
        return rows;
    },

    updateVehicleCount: async (station_id) => {
        const { rows } = await pool.query(
            `UPDATE stations
             SET count_vehicle=(SELECT COUNT(*) FROM station_vehicles WHERE station_id=$1),
                 updated_at=NOW()
             WHERE station_id=$1
             RETURNING *`,
            [station_id]
        );
        return rows[0] || null;
    },

    listStaff: async (station_id) => {
        const { rows } = await pool.query(
            `SELECT * FROM station_staff_members
             WHERE station_id=$1
             ORDER BY role DESC, created_at DESC`,
            [station_id]
        );
        return rows;
    },

    addStaff: async (station_id, staff_user_id, role = 'staff') => {
        const { rows } = await pool.query(
            `INSERT INTO station_staff_members (station_id, staff_user_id, role)
             VALUES ($1, $2, $3)
             ON CONFLICT (station_id, staff_user_id)
             DO UPDATE SET role = EXCLUDED.role,
                           updated_at = NOW()
             RETURNING *`,
            [station_id, staff_user_id, role]
        );
        return rows[0] || null;
    },

    removeStaff: async (station_id, staff_user_id) => {
        const { rowCount } = await pool.query(
            `DELETE FROM station_staff_members
             WHERE station_id=$1 AND staff_user_id=$2`,
            [station_id, staff_user_id]
        );
        return rowCount > 0;
    },

    isUserAssignedToStation: async (station_id, user_id) => {
        const { rows } = await pool.query(
            `SELECT 1
             FROM stations s
             LEFT JOIN station_staff_members sm ON sm.station_id = s.station_id AND sm.staff_user_id = $2
             WHERE s.station_id = $1 AND (s.user_id = $2 OR sm.staff_user_id IS NOT NULL)
             LIMIT 1`,
            [station_id, user_id]
        );
        return rows.length > 0;
    },

    deleteByUserId: async (user_id) => {
        const { rows } = await pool.query(
            `DELETE FROM stations
             WHERE user_id = $1
             RETURNING *`,
            [user_id]
        );
        return rows[0] || null;
    },

    deleteById: async (station_id) => {
        const { rows } = await pool.query(
            `DELETE FROM stations
             WHERE station_id = $1
             RETURNING *`,
            [station_id]
        );
        return rows[0] || null;
    },
};


