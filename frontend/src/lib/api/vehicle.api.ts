import { axiosClient } from '@/lib/axios';
import type { TCar } from '../types/car.type';

export const vehicleApi = {
	// Vehicles
	getVehicles: () => axiosClient.get<TCar[]>('/v1/vehicles'),
	getVehicle: (id: string | number) => axiosClient.get(`/v1/vehicles/${id}`),
	getVehicleBySlug: (slug: string) => axiosClient.get(`/v1/vehicles/slug/${slug}`),
	createVehicle: (data: any) => axiosClient.post('/v1/vehicles', data),
	updateVehicle: (id: string | number, data: any) =>
		axiosClient.put(`/v1/vehicles/${id}`, data),
	deleteVehicle: (id: string | number) => axiosClient.delete(`/v1/vehicles/${id}`),

	// Vehicle Images
	getVehicleImages: (carId: string | number) =>
		axiosClient.get(`/v1/vehicles/${carId}/images`),
	addVehicleImage: (carId: string | number, data: FormData) =>
		axiosClient.post(`/v1/vehicles/${carId}/images`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		}),

	// Vehicle Specifications
	getVehicleSpecifications: (carId: string | number) =>
		axiosClient.get(`/v1/vehicles/${carId}/specifications`),
	addVehicleSpecification: (carId: string | number, data: any) =>
		axiosClient.post(`/v1/vehicles/${carId}/specifications`, data),
}