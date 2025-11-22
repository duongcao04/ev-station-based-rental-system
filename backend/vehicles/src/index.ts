import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { rootRouter } from "./routes";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const app = express();

app.use(cors({
  origin: String(process.env.WEB_CLIENT_URL), // your frontend URL
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', rootRouter)

const port = (process.env.VEHICLE_PORT || 8099);

app.listen(port, () => {
  console.log(`Vehicle service port:::${port}`);
  console.log(process.env.VEHICLE_PORT);

});