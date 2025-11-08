import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { rentalApi } from "../api/rental.api"

export const useRentals = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["rentals"],
		queryFn: () => rentalApi.getRentals(),
	})

	return { data: data?.data || [], isLoading: isLoading || isFetching }
}

export const useCreateRental = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: any) => rentalApi.createRental(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rentals"] })
		},
	})
}

export const useUpdateRental = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ id, data }: { id: string | number; data: any }) => rentalApi.updateRental(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rentals"] })
		},
	})
}

export const useDeleteRental = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (id: string | number) => rentalApi.deleteRental(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["rentals"] })
		},
	})
}
