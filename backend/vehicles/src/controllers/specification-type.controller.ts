import { Request, Response } from "express";
import { SpecificationTypeService } from "../services/specification-type.service";

export const SpecificationTypeController = {
	list: async (req: Request, res: Response) => res.json(await SpecificationTypeService.findAll()),
	get: async (req: Request, res: Response) => {
		const item = await SpecificationTypeService.findOne(req.params.id);
		if (!item) return res.status(404).json({ message: "Specification type not found" });
		res.json(item);
	},
	create: async (req: Request, res: Response) => {
		const item = await SpecificationTypeService.create(req.body);
		res.status(201).json(item);
	},
	update: async (req: Request, res: Response) => {
		const item = await SpecificationTypeService.update(req.params.id, req.body);
		res.json(item);
	},
	remove: async (req: Request, res: Response) => {
		await SpecificationTypeService.remove(req.params.id);
		res.status(204).send();
	},
};