import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { vehicleApi } from "../api/vehicle.api"

export const useCarSpecifications = (carId: string) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["car-specifications"],
		queryFn: () => vehicleApi.getVehicleSpecifications(carId),
		select(res) {
			return res
		},
	})
	return { data, isLoading: isLoading || isFetching }
}

export const useCreateCarSpecificationMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ carId, data }: { carId: string, data: any }) => {
			return vehicleApi.addVehicleSpecification(carId, data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["car-specifications"] })
			toast.success("Car specification created successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to create car specification")
		},
	})
}