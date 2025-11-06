import { axiosClient } from "@/lib/axios";

export const specificationTypeApi = {
	getSpecificationTypes: () => axiosClient.get('/v1/specification-types'),
	getSpecificationType: (id: string | number) =>
		axiosClient.get(`/v1/specification-types/${id}`),
	createSpecificationType: (data: any) =>
		axiosClient.post('/v1/specification-types', data),
	updateSpecificationType: (id: string | number, data: any) =>
		axiosClient.put(`/v1/specification-types/${id}`, data),
	deleteSpecificationType: (id: string | number) =>
		axiosClient.delete(`/v1/specification-types/${id}`),
}