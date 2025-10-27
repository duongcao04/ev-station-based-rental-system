import { z } from "zod";

export const CreateSpecTypeDto = z.object({
	label: z.string().min(1),
	icon: z.string().optional(),
	description: z.string().optional(),
});
export type CreateSpecTypeDto = z.infer<typeof CreateSpecTypeDto>;

export const UpdateSpecTypeDto = CreateSpecTypeDto.partial();
export type UpdateSpecTypeDto = z.infer<typeof UpdateSpecTypeDto>;

export const SpecTypeIdParamDto = z.object({ id: z.string().uuid() });