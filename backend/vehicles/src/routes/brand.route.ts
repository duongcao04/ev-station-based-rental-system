import { Router } from "express";
import { BrandController } from "../controllers/brand.controller";
import { BrandIdParamDto, CreateBrand, UpdateBrandDto } from "../dto/brand.dto";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", BrandController.list);
router.get("/:id", validate(BrandIdParamDto, "params"), BrandController.get);
router.post("/", validate(CreateBrand), BrandController.create);
router.put("/:id", validate(BrandIdParamDto, "params"), validate(UpdateBrandDto), BrandController.update);
router.delete("/:id", validate(BrandIdParamDto, "params"), BrandController.remove);

export { router as brandRoutes };