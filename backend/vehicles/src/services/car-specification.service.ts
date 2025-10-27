import type { CreateCarSpecificationDto, UpdateCarSpecificationDto } from "../dto/car-specification.dto";
import { prisma } from "../helpers/prisma";

export const CarSpecificationService = {
	findAllByCard: (carId: string) => prisma.carSpecification.findMany({
		where: {
			carId
		},
		include: { specificationType: true }
	}),
	findOne: (id: string) => prisma.carSpecification.findUnique({ where: { id }, include: { specificationType: true } }),
	create: (carId: string, data: CreateCarSpecificationDto) => prisma.carSpecification.create({
		data: {
			...data,
			carId
		}
	}),
	update: (id: string, data: UpdateCarSpecificationDto) => prisma.carSpecification.update({ where: { id }, data }),
	remove: (id: string) => prisma.carSpecification.delete({ where: { id } }),
};