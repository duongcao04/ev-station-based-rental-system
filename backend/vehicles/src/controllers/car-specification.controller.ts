import { Request, Response } from "express";
import { CarSpecificationService } from "../services/car-specification.service";

export const CarSpecificationController = {
	list: async (req: Request, res: Response) => {
		const carId = req.params.carId
		return res.json(await CarSpecificationService.findAllByCard(carId))
	},
	get: async (req: Request, res: Response) => {
		const item = await CarSpecificationService.findOne(req.params.id);
		if (!item) return res.status(404).json({ message: "Car specification not found" });
		res.json(item);
	},
	create: async (req: Request, res: Response) => {
		const carId = req.params.carId
		const item = await CarSpecificationService.create(carId, req.body);
		res.status(201).json(item);
	},
	update: async (req: Request, res: Response) => {
		const item = await CarSpecificationService.update(req.params.id, req.body);
		res.json(item);
	},
	remove: async (req: Request, res: Response) => {
		await CarSpecificationService.remove(req.params.id);
		res.status(204).send();
	},
};