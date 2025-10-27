import { Request, Response } from "express";
import { CreateCarImageDto } from "../dto/car-image.dto";
import { CarImageService } from "../services/car-image.service";

export const CarImageController = {
	list: async (req: Request, res: Response) => {
		const carId = req.params.carId
		const result = await CarImageService.findAllByCar(carId)
		return res.json(result)
	},
	get: async (req: Request, res: Response) => {
		const item = await CarImageService.findOne(req.params.id);
		if (!item) return res.status(404).json({ message: "Car image not found" });
		res.json(item);
	},
	create: async (req: Request, res: Response) => {
		const { url, sort } = req.body as CreateCarImageDto
		const carId = req.params.carId
		const item = await CarImageService.create(carId, req.body);
		res.status(201).json(item);
	},
	update: async (req: Request, res: Response) => {
		const item = await CarImageService.update(req.params.id, req.body);
		res.json(item);
	},
	remove: async (req: Request, res: Response) => {
		await CarImageService.remove(req.params.id);
		res.status(204).send();
	},
};