import express from "express";
import dotenv from "dotenv";
import cookie from "cookie-parser";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import renterRoute from "./routes/renterRoute.js";
import adminRoute from "./routes/adminRoute.js";
import kycRoute from "./routes/kycRoute.js";
import cors from "cors";
import path from "path";


dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.AUTH_PORT;

console.log(process.env.AUTH_PORT);

//middlewares
app.use(express.json());
app.use(cookie());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

//public routes
app.use("/api/auth", authRoute);

//private routes
app.use("/api/admin", adminRoute);
app.use("/api/renters", renterRoute);
app.use("/api/kyc", kycRoute);

await connectDB(
  process.env.AUTH_DB_NAME,
  process.env.AUTH_DB_USER,
  process.env.AUTH_DB_PASSWORD
).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
});
