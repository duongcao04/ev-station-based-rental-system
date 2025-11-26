import { vehicleApi, type TVehicleQueryParams } from '@/lib/api/vehicle.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { CreateCarFormData, UpdateCarFormData } from '../schemas/car.schema';
import type { TFilterState } from '../../pages/thue-xe-tu-lai/components/FilterBarView';

export const useVehicles = (filters?: TFilterState) => {
	// 1. Chuyển đổi Filter State (Frontend) -> API Params (Backend)
	const queryParams: TVehicleQueryParams | undefined = filters ? {
		brands: filters.brands.length > 0 ? filters.brands : undefined,
		categories: filters.categories.length > 0 ? filters.categories : undefined,
		min: filters.priceRange.min > 0 ? filters.priceRange.min : undefined,
		max: filters.priceRange.max > 0 ? filters.priceRange.max : undefined,
	} : undefined;

	const { data, isLoading, isFetching } = useQuery({
		// 2. Thêm queryParams vào queryKey
		// Khi queryParams thay đổi -> Key thay đổi -> Tự động refetch
		queryKey: ['vehicles', queryParams],

		queryFn: () => vehicleApi.getVehicles(queryParams),

		select(res) {
			return res.data;
		},

		// Giữ data cũ trong khi đang fetch data mới để tránh giật giao diện
		placeholderData: (previousData) => previousData,
	});

	return { data, isLoading: isLoading || isFetching };
};

export const useVehicleDetail = (slug?: string) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['vehicle-detail', `slug=${slug}`],
		queryFn: () => {
			if (!slug) {
				return
			}
			return vehicleApi.getVehicleBySlug(slug)
		},
		enabled: !!slug,
		select(res) {
			return res?.data;
		},
	});
	return { data, isLoading: isLoading || isFetching };
};


export const useCreateVehicleMutation = () => {
	return useMutation({
		mutationFn: async (data: CreateCarFormData) => {
			return vehicleApi.createVehicle({
				...data,
				regularPrice: data.regularPrice.toString(),
				salePrice: data.salePrice?.toString(),
				depositPrice: data.depositPrice?.toString()
			})
		},
		onSuccess: () => {
			toast.success("Thêm mới xe thành công")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Thêm mới xe thất bại")
		},
	})
}

export const useUpdateVehicleMutation = () => {
	return useMutation({
		mutationFn: async (data: UpdateCarFormData) => {
			const { id, ...rest } = data;
			return vehicleApi.updateVehicle(id, {
				...rest,
				regularPrice: data.regularPrice?.toString(),
				salePrice: data.salePrice?.toString(),
				depositPrice: data.depositPrice?.toString()
			})
		},
		onSuccess: () => {
			toast.success("Cập nhật xe thành công")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Cập nhật xe thất bại")
		},
	})
}

export const useDeleteVehicleMutation = () => {
	return useMutation({
		mutationFn: async ({ id }: { id: string }) => {
			return vehicleApi.deleteVehicle(id)
		},
		onSuccess: () => {
			toast.success("Xóa xe thành công")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Xóa xe thất bại")
		},
	})
}