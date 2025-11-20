import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { getErrorMessage } from '../utils/error';

export const useProfile = () => {
	const { data, isLoading, isFetching, error } = useQuery({
		queryKey: ['profile'],
		queryFn: async () => {
			try {
				return await authApi.getProfile();
			} catch (err) {
				// Nếu không có auth (chưa login), return null thay vì throw error
				console.warn("Profile fetch error (user may not be logged in):", err);
				return null;
			}
		},
		select(res) {
			return res;
		},
		retry: false, // Không retry nếu fail (có thể user chưa login)
		refetchOnWindowFocus: false, // Không refetch khi focus window
	});
	const isAdmin = data?.role === 'admin'
	const isRenter = data?.role === "renter"
	const isStaff = data?.role === 'staff'

	return { data, isAdmin, isRenter, isStaff, isLoading: isLoading || isFetching, error };
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