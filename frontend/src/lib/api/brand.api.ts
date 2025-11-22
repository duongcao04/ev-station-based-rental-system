import { axiosClient } from "@/lib/axios"
import type { TBrand } from "@/lib/types/brand.type"

export const brandApi = {
	getBrands: () => axiosClient.get<TBrand[]>("/v1/brands"),
	getBrand: (id: string) => axiosClient.get<TBrand>(`/v1/brands/${id}`),
	createBrand: (data: Omit<TBrand, "id">) => axiosClient.post("/v1/brands", data),
	updateBrand: (id: string, data: Partial<Omit<TBrand, "id">>) => axiosClient.put(`/v1/brands/${id}`, data),
	deleteBrand: (id: string) => axiosClient.delete(`/v1/brands/${id}`),
}
