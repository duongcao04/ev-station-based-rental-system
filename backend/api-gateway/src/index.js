import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
const app = express();

app.use(cors());
app.use(morgan("dev"));

const TARGET = process.env.BOOKING_SERVICE_URL || "http://localhost:3000";
console.log("[Gateway] BOOKING_SERVICE_URL =", TARGET);


app.use(
    "/v1/api/bookings",
    createProxyMiddleware({
        target: TARGET,          // http://localhost:3000
        changeOrigin: true,
    
        pathRewrite: (path, _req) => {
            const rewritten = path === "/" ? "/v1/api/bookings" : `/v1/api/bookings${path}`;
            console.log("[GW] rewrite:", path, "->", rewritten);
            return rewritten;
        },
        proxyTimeout: 20000,
        timeout: 20000,
        logLevel: "debug",
        onError(err, _req, res) {
            console.error("[GW->booking]", err.code, err.message);
            if (!res.headersSent) res.status(502).json({ error: "Bad gateway", code: err.code });
        },
        
    })
);
// test
app.get("/health", (_req, res) => res.json({ ok: true, service: "gateway" }));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(process.env.PORT || 8000, () => {
    console.log(`🚀 API Gateway on http://localhost:${process.env.PORT || 8000}`);
});
