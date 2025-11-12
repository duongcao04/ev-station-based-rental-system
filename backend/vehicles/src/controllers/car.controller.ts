import { Request, Response } from "express";
import { CarService } from "../services/car.service";

export const CarController = {
	list: async (req: Request, res: Response) => res.json(await CarService.findAll()),
	getBySlug: async (req: Request, res: Response) => {
		const item = await CarService.findBySlug(req.params.slug);
		if (!item) return res.status(404).json({ message: "Car not found" });
		res.json(item);
	},
	get: async (req: Request, res: Response) => {
		const item = await CarService.findOne(req.params.id);
		if (!item) return res.status(404).json({ message: "Car not found" });
		res.json(item);
	},
	create: async (req: Request, res: Response) => {
		const item = await CarService.create(req.body);
		res.status(201).json(item);
	},
	update: async (req: Request, res: Response) => {
		const item = await CarService.update(req.params.id, req.body);
		res.json(item);
	},
	remove: async (req: Request, res: Response) => {
		await CarService.remove(req.params.id);
		res.status(204).send();
	},
};