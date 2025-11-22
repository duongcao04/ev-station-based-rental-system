import { axiosClient } from '@/lib/axios';
import type { TSpecificationType } from '../types/specification-type.type';

export const specificationTypeApi = {
	getSpecificationTypes: () => axiosClient.get<TSpecificationType[]>('/v1/specification-types'),
	getSpecificationType: (id: string) => axiosClient.get<TSpecificationType>(`/v1/specification-types/${id}`),
	createSpecificationType: (data: Omit<TSpecificationType, 'id'>) => axiosClient.post('/v1/specification-types', data),
	updateSpecificationType: (id: string, data: Partial<Omit<TSpecificationType, 'id'>>) =>
		axiosClient.put(`/v1/specification-types/${id}`, data),
	deleteSpecificationType: (id: string) => axiosClient.delete(`/v1/specification-types/${id}`),
};
