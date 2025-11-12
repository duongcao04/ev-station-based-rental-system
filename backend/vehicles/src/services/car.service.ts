import { prisma } from "../helpers/prisma";
import type { CreateCarDto, UpdateCarDto } from "../dto/car.dto";

export const CarService = {
	findAll: () => prisma.car.findMany({
		include: {
			brand: true,
			categories: true,
			specifications: { include: { specificationType: true } },
			featuredImages: true,
		},
	}),
	findBySlug: (slug: string) => prisma.car.findFirst({
		where: { slug },
		include: {
			brand: true,
			categories: true,
			specifications: { include: { specificationType: true } },
			featuredImages: true,
		},
	}),
	findOne: (id: string) => prisma.car.findUnique({
		where: { id },
		include: {
			brand: true,
			categories: true,
			specifications: { include: { specificationType: true } },
			featuredImages: true,
		},
	}),
	create: async (data: CreateCarDto) => {
		const { categoryIds, ...rest } = data;
		return prisma.car.create({
			data: {
				...rest,
				// attach categories if provided
				...(categoryIds && categoryIds.length ? { categories: { connect: categoryIds.map((id: string) => ({ id })) } } : {}),
			} as any,
			include: { brand: true, categories: true, specifications: true, featuredImages: true },
		});
	},
	update: async (id: string, data: UpdateCarDto) => {
		const { categoryIds, ...rest } = data || {} as any;
		return prisma.car.update({
			where: { id },
			data: {
				...rest,
				...(categoryIds ? { categories: { set: categoryIds.map((id: string) => ({ id })) } } : {}),
			} as any,
			include: { brand: true, categories: true, specifications: true, featuredImages: true },
		});
	},
	remove: (id: string) => prisma.car.delete({ where: { id } }),
};