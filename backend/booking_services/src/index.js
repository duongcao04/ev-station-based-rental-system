import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";

dotenv.config();
const app = express();

// Middleware setup - Order matters!
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

const port = (process.env.PORT || 4000);

app.use("/api", router);

app.listen(port, () => {
  console.log(` Booking Service đang chạy tại http://localhost:${port}`);
});