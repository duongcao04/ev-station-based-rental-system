import { Router } from "express";
import { CategoryController } from "../controllers/category.controller";
import { CreateCategoryDto, IdParamDto, UpdateCategoryDto } from "../dto/category.dto";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", CategoryController.list);
router.get("/:id", validate(IdParamDto, "params"), CategoryController.get);
router.post("/", validate(CreateCategoryDto), CategoryController.create);
router.put("/:id", validate(IdParamDto, "params"), validate(UpdateCategoryDto), CategoryController.update);
router.delete("/:id", validate(IdParamDto, "params"), CategoryController.remove);

export { router as categoryRoutes }