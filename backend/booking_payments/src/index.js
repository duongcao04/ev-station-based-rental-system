import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import pool from './config/db.js'

  dotenv.config();
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
 
  const port =(process.env.PORT || 3000);

  // route(app);

  app.get('/users', async (req, res) => {
      try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
      } catch (err) {
        console.error('Error executing query', err);
        res.status(500).send('Server Error');
      }
    });

  app.listen(port, () => {
    console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
  });