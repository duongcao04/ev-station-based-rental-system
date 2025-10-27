import { NextFunction, Request, Response } from "express";
import { ZodError, ZodObject } from "zod";

export const validate = (schema: ZodObject, source: "body" | "query" | "params" = "body") =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			const parsed = schema.parse((req as any)[source]);
			(req as any)[source] = parsed;
			next();
		} catch (err) {
			if (err instanceof ZodError) {
				return res.status(400).json({ message: "Validation error", issues: err.issues });
			}
			next(err);
		}
	};