import type { CreateCarImageDto, UpdateCarImageDto } from "../dto/car-image.dto";
import { prisma } from "../helpers/prisma";

export const CarImageService = {
	findAllByCar: (carId: string) => prisma.carImage.findMany({
		where: {
			carId
		}
	}),
	findOne: (id: string) => prisma.carImage.findUnique({ where: { id } }),
	create: (carId: string, data: CreateCarImageDto) => prisma.carImage.create({
		data: {
			...data,
			carId
		}
	}),
	update: (id: string, data: UpdateCarImageDto) => prisma.carImage.update({ where: { id }, data }),
	remove: (id: string) => prisma.carImage.delete({ where: { id } }),
};