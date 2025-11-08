import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import router from "./routes/index.js";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const app = express();

// Middleware setup - Order matters!
app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(cookieParser()); // Parse HTTP-only cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

const port = (process.env.BOOKING_PORT || 4000);

app.use("/api", router);

app.listen(port, () => {
  console.log(` Booking Service đang chạy tại http://localhost:${port}`);

});