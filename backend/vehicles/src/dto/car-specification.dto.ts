import { z } from "zod";

export const CreateCarSpecificationDto = z.object({
	value: z.string().min(1),
	specificationTypeId: z.string().uuid(),
});
export type CreateCarSpecificationDto = z.infer<typeof CreateCarSpecificationDto>;

export const UpdateCarSpecificationDto = z.object({
	value: z.string().min(1).optional(),
});
export type UpdateCarSpecificationDto = z.infer<typeof UpdateCarSpecificationDto>;

export const CarSpecificationIdParamDto = z.object({ id: z.string().uuid() });