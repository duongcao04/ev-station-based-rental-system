import { useQuery } from '@tanstack/react-query';
import { brandApi } from '../api/brand.api';

export const useBrands = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['brands'],
		queryFn: () => brandApi.getBrands(),
		select(res) {
			return res.data;
		},
	});
	return { data, isLoading: isLoading || isFetching };
};
