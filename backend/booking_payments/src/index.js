import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = (process.env.PORT || 3000);

app.use("/v1/api", router);



app.listen(port, () => {
  console.log(`Ứng dụng đang chạy tại http://localhost:${port}`);
});