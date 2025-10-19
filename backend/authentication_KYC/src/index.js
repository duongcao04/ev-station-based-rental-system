import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import renterRoute from "./routes/renterRoute.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//middlewares
app.use(express.json());
app.use(cookie());

//public routes
app.use("/api/auth", authRoute);

//private routes
app.use(protectedRoute);
app.use("/api/renters", renterRoute);

connectDB(
  process.env.DB_NAME,
  process.env.DB_USER,
  String(process.env.DB_PASS)
).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
});
