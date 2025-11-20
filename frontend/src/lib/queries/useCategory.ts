import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/category.api';

export const useCategories = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['categories'],
		queryFn: () => categoryApi.getCategories(),
		select(res) {
			return res.data;
		},
	});
	return { data, isLoading: isLoading || isFetching };
};
