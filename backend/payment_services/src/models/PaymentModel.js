import pool from '../config/db.js';

export const PaymentModel = {
    // create new booking
    async create({ booking_id, user_id, amount, type, payment_method, provider, description, status }) {
        const query = `
        INSERT INTO payments (booking_id, user_id, amount, type, payment_method, provider, description, status)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
        `;
        const values = [booking_id, user_id, amount, type, payment_method, provider, description, status || 'init'];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    async getById(payment_id) {
        const result = await pool.query(
            `SELECT * FROM payments WHERE payment_id = $1`,
            [payment_id]
        );
        return result.rows[0] || null;
    },

    async getByUserId(user_id, { status, limit = 50, offset = 0 } = {}) {
        const params = [user_id];
        let where = `user_id = $1`;
        if (status) {
            params.push(status);
            where += ` AND status = $${params.length}`;
        }
        params.push(limit, offset);
        const result = await pool.query(
            `SELECT * FROM payments WHERE ${where} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
            params
        );
        return result.rows;
    },

    async updateStatus(payment_id, status, { failure_reason = null, processed_at = null, completed_at = null } = {}) {
        const result = await pool.query(
            `UPDATE payments
             SET status = $2,
                 failure_reason = $3,
                 processed_at = COALESCE($4, processed_at),
                 completed_at = COALESCE($5, completed_at)
             WHERE payment_id = $1
             RETURNING *;`,
            [payment_id, status, failure_reason, processed_at, completed_at]
        );
        return result.rows[0] || null;
    },

    async refund(payment_id, { reason = 'refund' } = {}) {
        // mark as refunded and set completed_at/processed_at
        const now = new Date();
        const result = await pool.query(
            `UPDATE payments
             SET status = 'refunded',
                 failure_reason = NULL,
                 processed_at = $2,
                 completed_at = $2,
                 description = CONCAT(COALESCE(description, ''), CASE WHEN description IS NULL OR description = '' THEN '' ELSE ' | ' END, $3)
             WHERE payment_id = $1
             RETURNING *;`,
            [payment_id, now, reason]
        );
        return result.rows[0] || null;
    }
}