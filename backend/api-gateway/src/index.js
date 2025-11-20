import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { createProxyMiddleware } from "http-proxy-middleware";
import dotenv from "dotenv";
import path from "path";


dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const app = express();
const PORT = Number(process.env.API_GATEWAY_PORT) || 8000;


const pick = (v, def) => (typeof v === "string" && v.trim() ? v.trim() : def);
const SERVICES = {
    AUTH: pick(process.env.AUTH_SERVICE_URL, "http://localhost:5001"),
    BOOKING: pick(process.env.BOOKING_SERVICE_URL, "http://localhost:4000"),
    PAYMENT: pick(process.env.PAYMENT_SERVICE_URL, "http://localhost:5000"),
    VEHICLES: pick(process.env.VEHICLES_SERVICE_URL, "http://localhost:8099"),
    STATION: pick(process.env.STATION_SERVICE_URL, "http://localhost:6000"),
};


app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    cors({
        origin: pick(process.env.CLIENT_URL, "http://localhost:5173"),
        credentials: true,
    })
);

// ===== Helper tạo proxy =====
const makeProxy = (target, pathRewrite) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: false,
        proxyTimeout: 30000, // Tăng timeout lên 30s
        pathRewrite: pathRewrite || {},
        onProxyReq: (proxyReq, req) => {
            // Forward Authorization header
            if (req.headers["authorization"]) {
                proxyReq.setHeader("authorization", req.headers["authorization"]);
            }
            // Forward internal secret header (for service-to-service calls)
            if (req.headers["x-internal-secret"]) {
                proxyReq.setHeader("x-internal-secret", req.headers["x-internal-secret"]);
            }
            // Forward cookies
            if (req.headers.cookie) {
                proxyReq.setHeader("cookie", req.headers.cookie);
            }
            // Forward real IP
            proxyReq.setHeader("x-forwarded-for", req.ip || req.socket?.remoteAddress);
            proxyReq.setHeader("x-forwarded-host", req.hostname);

            // Log proxy request for debugging
            console.log(`[Gateway] Proxying ${req.method} ${req.originalUrl} → ${target}${proxyReq.path}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            // Log response (optional)
            console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);
            // Note: Set-Cookie headers tự động được forward bởi http-proxy-middleware
            // khi selfHandleResponse: false
        },
        onError: (err, req, res) => {
            console.error(`[Gateway] Proxy error to ${target}:`, err.message, err.code);
            console.error(`[Gateway] Request: ${req.method} ${req.originalUrl}`);
            if (!res.headersSent) {
                res.status(502).json({
                    error: "Bad Gateway",
                    detail: err.message,
                    target: target,
                    message: `Cannot connect to ${target}. Make sure the service is running.`
                });
            }
        },
        selfHandleResponse: false,
    });
};

// ===== Healthcheck Gateway =====
app.get("/healthz", (_req, res) =>
    res.json({ ok: true, service: "api-gateway", time: new Date().toISOString() })
);

// ================== AUTH SERVICE ==================
// Route /api/v1/auth/* và /api/auth/* → Auth Service
app.use(
    "/api/v1/auth",
    makeProxy(SERVICES.AUTH, (path) => `/api/auth${path}`)
);


// Route /api/v1/admin/* và /api/admin/* → Auth Service
app.use(
    "/api/v1/admin",
    makeProxy(SERVICES.AUTH, (path) => `/api/admin${path}`)
);


// Route /api/v1/renters/* và /api/renters/* → Auth Service
app.use(
    "/api/v1/renters",
    makeProxy(SERVICES.AUTH, (path) => `/api/renters${path}`)
);


// Route /api/v1/kyc/* và /api/kyc/* → Auth Service
app.use(
    "/api/v1/kyc",
    makeProxy(SERVICES.AUTH, (path) => `/api/kyc${path}`)
);

// Route /upload/* → Auth Service (for static files)
app.use(
    "/upload",
    makeProxy(SERVICES.AUTH, (path) => `/upload${path}`)
);

// ================== BOOKING SERVICE ==================
app.use(
    "/api/v1/bookings",
    makeProxy(SERVICES.BOOKING, (path, req) => {

        const newPath = `/api/v1/bookings${path === '/' ? '' : path}`;
        console.log(`[Gateway] Path rewrite: ${req.originalUrl} → ${newPath}`);
        return newPath;
    })
);

// ================== PAYMENT SERVICE ==================
// Route /api/v1/payments/* → Payment Service
app.use(
    "/api/v1/payments",
    makeProxy(SERVICES.PAYMENT, (path) => `/api/v1/payments${path}`)
);

// ================== VEHICLES SERVICE ==================
// Route /api/v1/vehicles/* và /v1/vehicles/* → Vehicles Service
app.use(
    "/api/v1/vehicles",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/vehicles${path}`)
);


// Route /api/v1/brands/* và /v1/brands/* → Vehicles Service
app.use(
    "/api/v1/brands",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/brands${path}`)
);


// Route /api/v1/categories/* và /v1/categories/* → Vehicles Service
app.use(
    "/api/v1/categories",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/categories${path}`)
);


// Route /api/v1/specification-types/* và /v1/specification-types/* → Vehicles Service
app.use(
    "/api/v1/specification-types",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/specification-types${path}`)
);
app.use(
    "/v1/specification-types",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/specification-types${path}`)
);

// ================== STATION SERVICE ==================
// Route /api/v1/stations/* → Station Service
app.use(
    "/api/v1/stations",
    makeProxy(SERVICES.STATION, (path) => `/api/v1/stations${path}`)
);

// ===== 404 Gateway (chỉ bật sau cùng) =====
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found at API Gateway",
        method: req.method,
        path: req.originalUrl,
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on http://localhost:${PORT}`);
    console.table({
        AUTH: SERVICES.AUTH,
        BOOKING: SERVICES.BOOKING,
        PAYMENT: SERVICES.PAYMENT,
        VEHICLES: SERVICES.VEHICLES,
        STATION: SERVICES.STATION,
    });
});