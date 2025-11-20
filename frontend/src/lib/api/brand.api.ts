import { axiosClient } from "@/lib/axios";

export const brandApi = {
	getBrands: () => axiosClient.get('/v1/brands'),
	getBrand: (id: string | number) => axiosClient.get(`/v1/brands/${id}`),
	createBrand: (data: any) => axiosClient.post('/v1/brands', data),
	updateBrand: (id: string | number, data: any) =>
		axiosClient.put(`/v1/brands/${id}`, data),
	deleteBrand: (id: string | number) => axiosClient.delete(`/v1/brands/${id}`),
}