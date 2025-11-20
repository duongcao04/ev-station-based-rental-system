import { z } from "zod";

// Decimal as string to avoid float issues in JSON
const DecimalString = z.string();

export const CreateCarDto = z.object({
	regularPrice: DecimalString,
	displayName: z.string(),
	sku: z.string(),
	slug: z.string(),
	salePrice: DecimalString.nullable().optional(),
	depositPrice: DecimalString.nullable().optional(),
	quantity: z.number().int().nullable().optional(),
	isInStock: z.boolean(),
	description: z.string().nullable().optional(),
	thumbnailUrl: z.string().url(),
	brandId: z.string().nullable().optional(),
	categoryIds: z.array(z.string()).optional(),
});
export type CreateCarDto = z.infer<typeof CreateCarDto>;

export const UpdateCarDto = CreateCarDto.partial();
export type UpdateCarDto = z.infer<typeof UpdateCarDto>;

export const CarIdParamDto = z.object({ id: z.string().uuid() });

export const CarSlugParamDto = z.object({ slug: z.string() });