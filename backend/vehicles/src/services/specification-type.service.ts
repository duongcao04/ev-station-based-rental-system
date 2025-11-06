import { prisma } from "../helpers/prisma";
import type { CreateSpecTypeDto, UpdateSpecTypeDto } from "../dto/specification-type.dto";

export const SpecificationTypeService = {
	findAll: () => prisma.specificationType.findMany(),
	findOne: (id: string) => prisma.specificationType.findUnique({ where: { id } }),
	create: (data: CreateSpecTypeDto) => prisma.specificationType.create({ data }),
	update: (id: string, data: UpdateSpecTypeDto) => prisma.specificationType.update({ where: { id }, data }),
	remove: (id: string) => prisma.specificationType.delete({ where: { id } }),
};