import { z } from "zod";

// Decimal as string to avoid float issues in JSON
const DecimalString = z.string().regex(/^\d+(?:\.\d{1,2})?$/, "Must be decimal with up to 2 places");

export const CreateCarDto = z.object({
	regularPrice: DecimalString,
	salePrice: DecimalString.nullable().optional(),
	depositPrice: DecimalString.nullable().optional(),
	quantity: z.number().int().nullable().optional(),
	isInStock: z.boolean(),
	description: z.string().nullable().optional(),
	thumbnailUrl: z.string().url(),
	brandId: z.string().uuid().nullable().optional(),
	categoryIds: z.array(z.string().uuid()).optional(),
});
export type CreateCarDto = z.infer<typeof CreateCarDto>;

export const UpdateCarDto = CreateCarDto.partial();
export type UpdateCarDto = z.infer<typeof UpdateCarDto>;

export const CarIdParamDto = z.object({ id: z.string().uuid() });