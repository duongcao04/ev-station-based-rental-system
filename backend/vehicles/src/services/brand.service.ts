import type { CreateBrand, UpdateBrandDto } from "../dto/brand.dto";
import { prisma } from "../helpers/prisma";

export const BrandService = {
	findAll: () => prisma.brand.findMany(),
	findOne: (id: string) => prisma.brand.findUnique({ where: { id } }),
	create: (data: CreateBrand) => prisma.brand.create({ data }),
	update: (id: string, data: UpdateBrandDto) => prisma.brand.update({ where: { id }, data }),
	remove: (id: string) => prisma.brand.delete({ where: { id } }),
};