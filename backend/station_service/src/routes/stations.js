import express from "express";
import { StationController } from "../controllers/StationController.js";
import { authenticate, authorize, ensureStationOwnership } from "../middleware/auth.js";

const router = express.Router();


if (process.env.NODE_ENV !== 'production') {
    router.post("/seed", StationController.seedSampleStations);
}

router.get("/", StationController.list);
router.get("/vehicles/:vehicle_id/stations", StationController.getStationsByVehicleId); 
router.get("/:user_id", StationController.getByUserId);


router.post("/", authenticate, authorize('staff', 'admin'), ensureStationOwnership, StationController.upsert);
router.patch("/:user_id", authenticate, authorize('staff', 'admin'), ensureStationOwnership, StationController.update);

router.get("/:user_id/vehicles", authenticate, authorize('renter', 'staff', 'admin'), StationController.listVehicles);
router.post("/:user_id/vehicles", authenticate, authorize('staff', 'admin'), ensureStationOwnership, StationController.addVehicle);
router.patch("/:user_id/vehicles/:vehicle_id", authenticate, authorize('staff', 'admin'), ensureStationOwnership, StationController.updateVehicleStatus);
router.delete("/:user_id/vehicles/:vehicle_id", authenticate, authorize('staff', 'admin'), ensureStationOwnership, StationController.removeVehicle);

export default router;


