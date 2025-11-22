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
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.AUTH_PORT;

console.log(process.env.AUTH_PORT);

//middlewares
app.use(express.json());
app.use(cookie());
app.use(cors({ origin: process.env.WEB_CLIENT_URL, credentials: true }));

// Serve static files (uploads)
app.use("/upload", express.static(path.join(__dirname, "../uploads")));

//public routes
app.use("/api/auth", authRoute);

//private routes
app.use("/api/admin", adminRoute);
app.use("/api/renters", renterRoute);
app.use("/api/kyc", kycRoute);

await connectDB(
  process.env.AUTH_DB_NAME || "auth_service_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASSWORD || "root1234"
).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
});
