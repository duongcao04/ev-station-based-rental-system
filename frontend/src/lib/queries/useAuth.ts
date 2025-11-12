import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/error';

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
    mutationFn: async ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => {
      return authApi.signIn(username, password)
    },
    onSuccess: (data) => {
      const message = data?.message || "Đăng nhập thành công"
      toast.success(message)
    },
    onError: (error) => {
      console.error(error)
      toast.error(getErrorMessage(error, "Đăng nhập thất bại"))
    },
  })
}