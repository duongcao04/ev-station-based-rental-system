import express from "express";
import dotenv from "dotenv";
import stationsRouter from "./routes/stations.js";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/v1/stations", stationsRouter);

const port = process.env.PORT || 6000;
app.listen(port, () => {
    console.log(` Station service running at http://localhost:${port}`);
});


