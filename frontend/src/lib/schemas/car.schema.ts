import { z } from "zod"

// Define decimal string type for prices
export const DecimalString = z
	.string()
	.refine((val) => /^\d+(\.\d{1,2})?$/.test(val), { message: "Vui lòng nhập số hợp lệ với tối đa 2 chữ số thập phân" })

export const CreateCarSchema = z.object({
	regularPrice: z.number(),
	displayName: z.string().min(1, "Tên xe là bắt buộc"),
	sku: z.string().min(1, "SKU là bắt buộc"),
	slug: z.string().min(1, "Slug là bắt buộc"),
	salePrice: z.number().optional(),
	depositPrice: z.number().optional(),
	quantity: z.number().optional(),
	isInStock: z.boolean(),
	description: z.string().nullable().optional(),
	thumbnailUrl: z.string().url("URL hình ảnh không hợp lệ"),
	brandId: z.string().nullable().optional(),
	categoryIds: z.array(z.string()).optional(),
})

export type CreateCarFormData = z.infer<typeof CreateCarSchema>
