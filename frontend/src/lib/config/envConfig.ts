import { z } from 'zod'

const configSchema = z.object({
	VITE_API_ENDPOINT: z.string().url(),
	VITE_URL: z.string().url(),
})

function configProject() {
	const parsed = configSchema.safeParse({
		VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT,
		VITE_URL: import.meta.env.VITE_URL,
	})

	if (!parsed.success) {
		console.error(parsed.error.format())
		throw new Error('Các giá trị khai báo trong file .env không hợp lệ')
	}

	return parsed.data
}

export const envConfig = configProject()
