import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { vehicleApi } from "../api/vehicle.api"

export const useCarImages = (carId: string) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["car-images"],
		queryFn: () => vehicleApi.getVehicleImages(carId),
		select(res) {
			return res
		},
	})
	return { data, isLoading: isLoading || isFetching }
}

export const useCreateCarImageMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ carId, data }: { carId: string, data: any }) => {
			return vehicleApi.addVehicleImage(carId, data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["car-images"] })
			toast.success("Car image created successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to create car image")
		},
	})
}
