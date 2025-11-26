import { Request, Response } from "express";
import { CarService } from "../services/car.service";
import { CarFilterParamsDto } from "../dto/car-filter-params.dto";
// Helper: Parse query param sang mảng string an toàn
// Query param trong Express có thể là: string | string[] | undefined (tùy thuộc vào library qs)
const parseArrayParam = (query: any, key: string): string[] | undefined => {
	// 1. Thử lấy key chuẩn (vd: brands)
	let value = query[key];

	// 2. Nếu không có, thử lấy key kiểu mảng của Axios (vd: brands[])
	if (!value) {
		value = query[`${key}[]`];
	}

	if (!value) return undefined;

	// 3. Nếu là mảng, lọc các giá trị string
	if (Array.isArray(value)) {
		return value.filter((item: any) => typeof item === 'string') as string[];
	}

	// 4. Nếu là string đơn (khi chọn 1 item), đưa vào mảng
	if (typeof value === 'string') {
		return [value];
	}

	return undefined;
};

const parseNumberParam = (value: any): number | undefined => {
	if (!value) return undefined;
	const num = Number(value);
	return isNaN(num) ? undefined : num;
};

export const CarController = {
	list: async (req: Request, res: Response) => {
		try {
			// LOG ĐỂ DEBUG: Xem frontend gửi gì lên
			console.log("👉 [DEBUG] Raw Query:", req.query);

			const { min, max } = req.query;

			const filters: CarFilterParamsDto = {
				// Dùng hàm helper mới, truyền vào toàn bộ query object và key cần lấy
				brandIds: parseArrayParam(req.query, 'brands'),
				categoryIds: parseArrayParam(req.query, 'categories'),
				minPrice: parseNumberParam(min),
				maxPrice: parseNumberParam(max),
			};

			console.log("👉 [DEBUG] Parsed Filters:", filters);

			const cars = await CarService.findAll(filters);
			return res.json(cars);
		} catch (error) {
			console.error('[CarController] Error:', error);
			return res.status(500).json({ message: 'Internal Server Error' });
		}
	},
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