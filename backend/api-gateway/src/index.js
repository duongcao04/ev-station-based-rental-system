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


// const pick = (v, def) => (typeof v === "string" && v.trim() ? v.trim() : def);
const SERVICES = {
    AUTH: String(process.env.AUTH_SERVICE_URL),
    BOOKING: String(process.env.BOOKING_SERVICE_URL),
    PAYMENT: String(process.env.PAYMENT_SERVICE_URL),
    VEHICLES: String(process.env.VEHICLES_SERVICE_URL),
    STATION: String(process.env.STATION_SERVICE_URL),
    NOTIFICATIONS: String(process.env.NOTIFICATIONS_SERVICE_URL),
};


app.use(morgan("dev"));
app.use(cookieParser());
app.use(
    cors({
        origin: String(process.env.WEB_CLIENT_URL),
        credentials: true,
    })
);

// ===== Helper tạo proxy =====
const makeProxy = (target, pathRewrite) => {
    return createProxyMiddleware({
        target,
        changeOrigin: true,
        ws: false,
        proxyTimeout: 30000,
        pathRewrite: pathRewrite || {},
        onProxyReq: (proxyReq, req) => {

            if (req.headers["authorization"]) {
                proxyReq.setHeader("authorization", req.headers["authorization"]);
            }

            if (req.headers["x-internal-secret"]) {
                proxyReq.setHeader("x-internal-secret", req.headers["x-internal-secret"]);
            }

            if (req.headers.cookie) {
                proxyReq.setHeader("cookie", req.headers.cookie);
            }

            proxyReq.setHeader("x-forwarded-for", req.ip || req.socket?.remoteAddress);
            proxyReq.setHeader("x-forwarded-host", req.hostname);


            console.log(`[Gateway] Proxying ${req.method} ${req.originalUrl} → ${target}${proxyReq.path}`);
        },
        onProxyRes: (proxyRes, req, res) => {
            console.log(`[Gateway] ${req.method} ${req.originalUrl} → ${proxyRes.statusCode}`);

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
app.get("/health", (_req, res) =>
    res.json({ ok: true, service: "api-gateway", time: new Date().toISOString() })
);

// ================== AUTH SERVICE ==================

app.use(
    "/api/v1/auth",
    makeProxy(SERVICES.AUTH, (path) => `/api/auth${path}`)
);


app.use(
    "/api/v1/admin",
    makeProxy(SERVICES.AUTH, (path) => `/api/admin${path}`)
);


app.use(
    "/api/v1/renters",
    makeProxy(SERVICES.AUTH, (path) => `/api/renters${path}`)
);


app.use(
    "/api/v1/kyc",
    makeProxy(SERVICES.AUTH, (path) => `/api/kyc${path}`)
);

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
app.use(
    "/api/v1/payments",
    makeProxy(SERVICES.PAYMENT, (path) => `/api/v1/payments${path}`)
);

// ================== VEHICLES SERVICE ==================

app.use(
    "/api/v1/vehicles",
    makeProxy("http://vehicles_service:8099", (path) => `/api/v1/vehicles${path}`)
);

app.use(
    "/api/v1/brands",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/brands${path}`)
);


app.use(
    "/api/v1/categories",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/categories${path}`)
);


app.use(
    "/api/v1/specification-types",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/specification-types${path}`)
);
app.use(
    "/v1/specification-types",
    makeProxy(SERVICES.VEHICLES, (path) => `/api/v1/specification-types${path}`)
);

// ================== STATION SERVICE ==================
app.use(
    "/api/v1/stations",
    makeProxy(SERVICES.STATION, (path) => `/api/v1/stations${path}`)
);

// ================== NOTIFICATION SERVICE ==================
app.use(
    "/api/v1/notifications",
    makeProxy(SERVICES.NOTIFICATIONS, (path) => `/api/v1/notifications${path}`)
);
app.use(
    "/api/v1/devices",
    makeProxy(SERVICES.NOTIFICATIONS, (path) => `/api/v1/devices${path}`)
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
        NOTIFICATIONS: SERVICES.NOTIFICATIONS,
    });
});