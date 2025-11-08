import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import path from "path";
import router from "./routes/index.js";
import cors from "cors"

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*', credentials: true }));
app.use(cookieParser()); // Parse HTTP-only cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", router);


const port = (process.env.PAY_PORT || 5000);

app.listen(port, () => console.log(` Server running on http://localhost:${port} , ${process.env.PAY_PORT}`));
