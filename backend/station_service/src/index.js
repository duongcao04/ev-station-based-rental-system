import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import stationsRouter from "./routes/stations.js";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();

// Middleware
app.use(cors({
    origin: process.env.WEB_CLIENT_URL || "*",
    credentials: true
}));
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/v1/stations", stationsRouter);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        error: "Not found",
        path: req.url,
        method: req.method
    });
});

const port = process.env.STATION_PORT || 6000;
app.listen(port, () => {
    console.log(`Station service running at http://localhost:${port}`);
});


