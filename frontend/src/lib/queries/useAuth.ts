import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';

export const useProfile = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ['profile'],
		queryFn: () => authApi.getProfile(),
		select(res) {
			return res;
		},
	});
	const isAdmin = data?.role === 'admin'
	const isRenter = data?.role === "renter"
	const isStaff = data?.role === 'staff'

	return { data, isAdmin, isRenter, isStaff, isLoading: isLoading || isFetching };
};

export const useLogin = () => {
	return useMutation({
		/**
		 * The mutationFn is the async function that performs the mutation.
		 * It receives a single 'variables' object. We destructure it
		 * to get the arguments for your authApi.signUp function.
		 */
		mutationFn: async ({ username, password }: { username: string, password: string }) => {
			// This is your original async call
			return authApi.signIn(username, password);
		},

		/**
		 * (Optional) This runs if the mutation is successful.
		 * 'data' is whatever your authApi.signUp function returns.
		 */
		onSuccess: () => {

			toast.success("Đăng ký thành công");

			// A common pattern is to invalidate queries that
			// should be refetched after a successful sign-up,
			// like fetching the current user.
			// queryClient.invalidateQueries({ queryKey: ['currentUser'] });
		},

		/**
		 * (Optional) This runs if the mutation throws an error.
		 */
		onError: (error) => {
			console.error(error);
			const message =
				(error as any)?.response?.data?.message ||
				(error as any)?.response?.data?.msg ||
				"Đăng ký thất bại";
			toast.error(message);
		},
	});
};