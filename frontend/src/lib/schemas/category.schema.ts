import { z } from "zod"

export const CreateCategorySchema = z.object({
	displayName: z.string().min(1, "Tên danh mục là bắt buộc"),
	description: z.string().nullable().optional(),
	thumbnailUrl: z.string().url("URL hình ảnh không hợp lệ"),
})

export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>

export const UpdateCategorySchema = CreateCategorySchema.partial().extend({
	id: z.string(),
});
export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;
