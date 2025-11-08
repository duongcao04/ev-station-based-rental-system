import express from 'express';
import dotenv from "dotenv";
import router from "./routes/index.js";
import cors from "cors"

dotenv.config({ path: "../.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api", router);


const port = (process.env.PAY_PORT || 5000);

app.listen(port, () => console.log(` Server running on http://localhost:${port} , ${process.env.PAY_PORT}`));
