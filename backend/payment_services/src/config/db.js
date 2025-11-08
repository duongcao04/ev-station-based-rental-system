import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
const { Pool } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

// Database configuration for Booking Service
const pool = new Pool({
  user: process.env.PAY_DB_USER || 'postgres',
  host: process.env.PAY_DB_HOST || 'localhost',
  database: process.env.PAY_DB_NAME || 'payment_service_db',
  password: process.env.PAY_DB_PASSWORD || 'root1234',
  port: process.env.PAY_DB_PORT || 5432,
});

// Test database connection
pool.connect()
  .then(client => {
    console.log(' Connected to PostgreSQL successfully!');
    client.release();
  })
  .catch(err => console.error(' Database connection error:', err.stack));

export default pool;