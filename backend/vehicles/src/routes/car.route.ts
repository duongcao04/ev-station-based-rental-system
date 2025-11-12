import { Router } from "express";
import { CarImageController } from "../controllers/car-image.controller";
import { CarSpecificationController } from "../controllers/car-specification.controller";
import { CarController } from "../controllers/car.controller";
import { CreateCarImageDto } from "../dto/car-image.dto";
import { CreateCarSpecificationDto } from "../dto/car-specification.dto";
import { CarIdParamDto, CarSlugParamDto, CreateCarDto, UpdateCarDto } from "../dto/car.dto";
import { validate } from "../middlewares/validate";

const router = Router();

// Car routes
router.get("/", CarController.list);
router.get("/:id", validate(CarIdParamDto, "params"), CarController.get);
router.get("/slug/:slug", validate(CarSlugParamDto, "params"), CarController.getBySlug);
router.post("/", validate(CreateCarDto), CarController.create);
router.put("/:id", validate(UpdateCarDto, "params"), validate(UpdateCarDto), CarController.update);
router.delete("/:id", validate(CarIdParamDto, "params"), CarController.remove);

// Car images routes
router.get("/:carId/images", CarImageController.list);
router.post("/:carId/images", validate(CreateCarImageDto), CarImageController.create);

// Car Specs routes
router.get("/:carId/specifications", CarSpecificationController.list);
router.post("/:carId/specifications", validate(CreateCarSpecificationDto), CarSpecificationController.create);

export { router as carRoutes };

