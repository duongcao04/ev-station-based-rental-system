import express from "express";
import { profile } from "../controllers/renterController.js";

const router = express.Router();

router.post("/profile", profile);

export default router;
