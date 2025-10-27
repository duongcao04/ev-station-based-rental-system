import type { CreateCategoryDto, UpdateCategoryDto } from "../dto/category.dto";
import { prisma } from "../helpers/prisma";

export const CategoryService = {
	findAll: () => prisma.category.findMany(),
	findOne: (id: string) => prisma.category.findUnique({ where: { id } }),
	create: (data: CreateCategoryDto) => prisma.category.create({ data }),
	update: (id: string, data: UpdateCategoryDto) => prisma.category.update({ where: { id }, data }),
	remove: (id: string) => prisma.category.delete({ where: { id } }),
};