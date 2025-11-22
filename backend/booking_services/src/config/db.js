import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
const { Pool } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.BOOKING_DB_NAME || "booking_service_db",
  password: process.env.DB_PASSWORD || "root1234",
  port: Number(process.env.DB_PORT) || 5432,
});

pool.on('connect', () => {
  console.log(' Connected to Booking Service Database');
});

pool.on('error', (err) => {
  console.error(' Database connection error:', err);
});

export default pool;