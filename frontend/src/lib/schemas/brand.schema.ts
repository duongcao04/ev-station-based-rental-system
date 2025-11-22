import { z } from "zod"

export const CreateBrandSchema = z.object({
	displayName: z.string().min(1, "Tên xe là bắt buộc"),
	description: z.string().nullable().optional(),
	thumbnailUrl: z.string().url("URL hình ảnh không hợp lệ"),
})

export type CreateBrandFormData = z.infer<typeof CreateBrandSchema>

export const UpdateBrandSchema = CreateBrandSchema.partial().extend({
	id: z.string(),
});
export type UpdateBrandFormData = z.infer<typeof UpdateBrandSchema>;
