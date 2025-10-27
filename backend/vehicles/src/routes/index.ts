import { Router } from "express";
import { brandRoutes } from "./brand.route";
import { carRoutes } from "./car.route";
import { categoryRoutes } from './category.route';
import { specificationTypeRoutes } from "./specification-type.route";

const router = Router();

router.use('/v1/categories', categoryRoutes);
router.use('/v1/brands', brandRoutes);
router.use('/v1/specification-types', specificationTypeRoutes);
router.use('/v1/vehicles', carRoutes);

export { router as rootRouter }