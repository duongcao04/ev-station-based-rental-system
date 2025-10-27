import pool from '../config/db.js';
import { authorize } from '../middleware/auth.js';

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
    }
}