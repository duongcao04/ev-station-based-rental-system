import { z } from "zod";

export const CreateCarImageDto = z.object({
	url: z.string().url(),
	sort: z.number().int().optional(),
});
export type CreateCarImageDto = z.infer<typeof CreateCarImageDto>;

export const UpdateCarImageDto = z.object({
	url: z.string().url().optional(),
	sort: z.number().int().nullable().optional(),
});
export type UpdateCarImageDto = z.infer<typeof UpdateCarImageDto>;

export const CarImageIdParamDto = z.object({ id: z.string().uuid() });