import { Router } from "express";
import { SpecificationTypeController } from "../controllers/specification-type.controller";
import { CreateSpecTypeDto, SpecTypeIdParamDto, UpdateSpecTypeDto } from "../dto/specification-type.dto";
import { validate } from "../middlewares/validate";

const router = Router();

router.get("/", SpecificationTypeController.list);
router.get("/:id", validate(SpecTypeIdParamDto, "params"), SpecificationTypeController.get);
router.post("/", validate(CreateSpecTypeDto), SpecificationTypeController.create);
router.put("/:id", validate(SpecTypeIdParamDto, "params"), validate(UpdateSpecTypeDto), SpecificationTypeController.update);
router.delete("/:id", validate(SpecTypeIdParamDto, "params"), SpecificationTypeController.remove);

export { router as specificationTypeRoutes };