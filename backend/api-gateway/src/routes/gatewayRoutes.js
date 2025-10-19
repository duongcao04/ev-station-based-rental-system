
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const onProxyError = (err, _req, res) => {
  console.error("[GW->booking]", err.code, err.message);
  if (!res.headersSent) {
    res.status(502).json({ error: "Bad gateway to booking", code: err.code });
  }
};

export default function buildGatewayRouter() {
  const router = express.Router();

  const TARGET = process.env.BOOKING_SERVICE_URL; 
  if (!TARGET) {
    throw new Error('Missing env BOOKING_SERVICE_URL (ví dụ "http://localhost:3000")');
  }
  console.log("[Gateway] BOOKING_SERVICE_URL =", TARGET);

 
  router.use(
    "/api/bookings",
    createProxyMiddleware({
      target: TARGET,
      changeOrigin: true,
      proxyTimeout: 20000,
      timeout: 20000,
      onError: onProxyError,
    })
  );

  return router;
}
