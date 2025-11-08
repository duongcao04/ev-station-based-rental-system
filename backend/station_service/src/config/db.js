import pkg from "pg";
import dotenv from "dotenv";
import path from "path";
const { Pool } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

// Database configuration for Station Service
const pool = new Pool({
  user: process.env.STATION_DB_USER || 'postgres',
  host: process.env.STATION_DB_HOST || 'localhost',
  database: process.env.STATION_DB_NAME || 'station_service_db',
  password: process.env.STATION_DB_PASSWORD || 'root1234',
  port: process.env.STATION_DB_PORT || 5432,
});

// Test database connection
pool.connect()
  .then(client => {
    console.log(' Connected to Station Service Database');
    client.release();
  })
  .catch(err => console.error(' Station Service Database connection error:', err.stack));

export default pool;