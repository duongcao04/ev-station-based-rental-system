import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rootRouter from "./routes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', rootRouter)

const port = (process.env.PORT || 9000);

app.listen(port, () => {
  console.log(`Notification service port:::${port}`);
});