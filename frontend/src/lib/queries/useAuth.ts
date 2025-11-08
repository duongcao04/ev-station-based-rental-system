import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';

export const useProfile = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['profile'],
		queryFn: () => authApi.fetchMe(),
		select(res) {
			return res;
		},
	});
	return { data, isLoading: isLoading || isFetching };
};
