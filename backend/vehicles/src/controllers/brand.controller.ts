import { Request, Response } from "express";
import { BrandService } from "../services/brand.service";

export const BrandController = {
	list: async (req: Request, res: Response) => res.json(await BrandService.findAll()),
	get: async (req: Request, res: Response) => {
		const item = await BrandService.findOne(req.params.id);
		if (!item) return res.status(404).json({ message: "Brand not found" });
		res.json(item);
	},
	create: async (req: Request, res: Response) => {
		const item = await BrandService.create(req.body);
		res.status(201).json(item);
	},
	update: async (req: Request, res: Response) => {
		const item = await BrandService.update(req.params.id, req.body);
		res.json(item);
	},
	remove: async (req: Request, res: Response) => {
		await BrandService.remove(req.params.id);
		res.status(204).send();
	},
};