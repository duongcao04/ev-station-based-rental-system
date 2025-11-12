import { vehicleApi } from '@/lib/api/vehicle.api';
import { useQuery } from '@tanstack/react-query';

export const useVehicles = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['vehicles'],
		queryFn: () => vehicleApi.getVehicles(),
		select(res) {
			return res.data;
		},
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
