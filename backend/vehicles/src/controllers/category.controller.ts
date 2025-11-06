import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export const CategoryController = {
	list: async (req: Request, res: Response) => res.json(await CategoryService.findAll()),
	get: async (req: Request, res: Response) => {
		const item = await CategoryService.findOne(req.params.id);
		if (!item) return res.status(404).json({ message: "Category not found" });
		res.json(item);
	},
	create: async (req: Request, res: Response) => {
		const item = await CategoryService.create(req.body);
		res.status(201).json(item);
	},
	update: async (req: Request, res: Response) => {
		const item = await CategoryService.update(req.params.id, req.body);
		res.json(item);
	},
	remove: async (req: Request, res: Response) => {
		await CategoryService.remove(req.params.id);
		res.status(204).send();
	},
};