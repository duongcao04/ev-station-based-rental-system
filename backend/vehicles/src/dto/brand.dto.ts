import { z } from "zod";

export const CreateBrand = z.object({
	displayName: z.string().min(1),
	description: z.string().min(1),
	thumbnailUrl: z.string().url().optional(),
});
export type CreateBrand = z.infer<typeof CreateBrand>;

export const UpdateBrandDto = CreateBrand.partial();
export type UpdateBrandDto = z.infer<typeof UpdateBrandDto>;

export const BrandIdParamDto = z.object({ id: z.string().uuid() });