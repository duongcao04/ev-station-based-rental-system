import { z } from 'zod';

export const CreateCategoryDto = z.object({
	displayName: z.string().min(1),
	description: z.string().min(1),
	thumbnailUrl: z.string().url().optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDto>;


export const UpdateCategoryDto = CreateCategoryDto.partial();
export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDto>;

export const IdParamDto = z.object({ id: z.string().uuid() });