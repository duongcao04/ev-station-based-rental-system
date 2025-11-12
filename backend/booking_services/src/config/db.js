import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
const { Pool } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

// Database configuration for Booking Service
const pool = new Pool({
  user: process.env.BOOKING_DB_USER || 'booking_user',
  host: process.env.BOOKING_DB_HOST || 'localhost',
  database: process.env.BOOKING_DB_NAME || 'booking_service_db',
  password: process.env.BOOKING_DB_PASSWORD || 'booking_password',
  port: process.env.BOOKING_DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log(' Connected to Booking Service Database');
});

pool.on('error', (err) => {
  console.error(' Database connection error:', err);
});

export default pool;