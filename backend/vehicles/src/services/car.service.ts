import { prisma } from "../helpers/prisma";
import type { CreateCarDto, UpdateCarDto } from "../dto/car.dto";
import { CarFilterParamsDto } from "../dto/car-filter-params.dto";
import { Prisma } from "@prisma/client";

export const CarService = {
	findAll: async (params: CarFilterParamsDto) => {
		const { brandIds, categoryIds, minPrice, maxPrice } = params;

		const where: Prisma.CarWhereInput = {
			AND: [],
		};

		// 1. Filter Brand
		if (brandIds && brandIds.length > 0) {
			(where.AND as Prisma.CarWhereInput[]).push({
				brandId: { in: brandIds },
			});
		}

		// 2. Filter Category
		if (categoryIds && categoryIds.length > 0) {
			(where.AND as Prisma.CarWhereInput[]).push({
				categories: {
					some: {
						id: { in: categoryIds },
					},
				},
			});
		}

		// 3. Filter Price (Logic ưu tiên salePrice)
		// Chỉ chạy logic này nếu có min hoặc max
		if ((minPrice !== undefined) || (maxPrice !== undefined)) {
			const min = minPrice || 0;
			// Nếu maxPrice = 0 hoặc undefined thì coi như không giới hạn (undefined)
			// Prisma: lte: undefined sẽ bị bỏ qua (đúng ý đồ)
			const max = (maxPrice && maxPrice > 0) ? maxPrice : undefined;

			const priceCondition = {
				gte: min,
				...(max !== undefined && { lte: max }), // Chỉ thêm lte nếu max tồn tại
			};

			(where.AND as Prisma.CarWhereInput[]).push({
				OR: [
					// Case 1: Có khuyến mãi -> Check salePrice
					{
						salePrice: { not: null, ...priceCondition },
					},
					// Case 2: Không khuyến mãi -> Check regularPrice
					{
						salePrice: null,
						regularPrice: { ...priceCondition },
					},
				],
			});
		}

		// Log câu lệnh where cuối cùng để debug
		console.log("👉 [DEBUG] Prisma Where:", JSON.stringify(where, null, 2));

		return prisma.car.findMany({
			where,
			include: {
				brand: true,
				categories: true,
				specifications: { include: { specificationType: true } },
				featuredImages: { orderBy: { sort: 'asc' } },
			},
			orderBy: { displayName: 'asc' }, // Hoặc trường nào bạn có để sort
		});
	},
	findBySlug: (slug: string) => prisma.car.findFirst({
		where: { slug },
		include: {
			brand: true,
			categories: true,
			specifications: {
				include: { specificationType: true },
				// Sắp xếp theo tên thông số để hiển thị nhất quán
				orderBy: {
					specificationType: {
						label: 'asc'
					}
				}
			},
			featuredImages: {
				orderBy: { sort: 'asc' } // Sắp xếp ảnh theo thứ tự ưu tiên
			},
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
			},
			include: { brand: true, categories: true, specifications: true, featuredImages: true },
		});
	},
	update: async (id: string, data: UpdateCarDto) => {
		const { categoryIds, ...rest } = data || {};
		return prisma.car.update({
			where: { id },
			data: {
				...rest,
				...(categoryIds ? { categories: { set: categoryIds.map((id: string) => ({ id })) } } : {}),
			},
			include: { brand: true, categories: true, specifications: true, featuredImages: true },
		});
	},
	remove: (id: string) => prisma.car.delete({ where: { id } }),
};