import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;

dotenv.config();

// Database configuration for Booking Service
const pool = new Pool({
  user: process.env.DB_USER || 'booking_user',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'booking_service_db',
  password: process.env.DB_PASSWORD || 'booking_password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.on('connect', () => {
  console.log(' Connected to Booking Service Database');
});

pool.on('error', (err) => {
  console.error(' Database connection error:', err);
});

export default pool;