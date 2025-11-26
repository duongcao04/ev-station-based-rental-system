import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { rootRouter } from "./routes";
import "./cron/jobs";


dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
const app = express();

app.use(cors({
  origin: String(process.env.WEB_CLIENT_URL),
  credentials: true, // allow cookies / auth headers
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Routes
app.use('/api', rootRouter);

// 5. Health Check 
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Notification Service' });
});

const port = (process.env.NOTIFICATION_PORT || 9000);

app.listen(port, () => {
  console.log(`Notification service port:::${port}`);
});