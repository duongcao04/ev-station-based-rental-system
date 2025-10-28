import { axiosClient } from "@/lib/axios";

export const categoryApi = {
	getCategories: () => axiosClient.get('/v1/categories'),
	getCategory: (id: string | number) => axiosClient.get(`/v1/categories/${id}`),
	createCategory: (data: any) => axiosClient.post('/v1/categories', data),
	updateCategory: (id: string | number, data: any) =>
		axiosClient.put(`/v1/categories/${id}`, data),
	deleteCategory: (id: string | number) => axiosClient.delete(`/v1/categories/${id}`),
}