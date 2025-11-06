import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { rootRouter } from "./routes";

dotenv.config({ path: "../.env" });
const app = express();

app.use(cors({
  origin: String(process.env.VEHICLES_CLIENT_URL), // your frontend URL
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', rootRouter)

const port = (process.env.VEHICLES_PORT || 9000);

app.listen(port, () => {
  console.log(`Vehicle service port:::${port}`);
    console.log(process.env.VEHICLES_PORT);

});