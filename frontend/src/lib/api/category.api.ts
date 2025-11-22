import { axiosClient } from '@/lib/axios';
import type { TCategory } from '../types/category.type';

export const categoryApi = {
	getCategories: () => axiosClient.get<TCategory[]>('/v1/categories'),
	getCategory: (id: string) => axiosClient.get<TCategory>(`/v1/categories/${id}`),
	createCategory: (data: Omit<TCategory, 'id'>) => axiosClient.post('/v1/categories', data),
	updateCategory: (id: string, data: Partial<Omit<TCategory, 'id'>>) =>
		axiosClient.put(`/v1/categories/${id}`, data),
	deleteCategory: (id: string) => axiosClient.delete(`/v1/categories/${id}`),
};
