import { specificationTypeApi } from "@/lib/api/specification-type.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useSpecificationTypes = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["specification-types"],
		queryFn: () => specificationTypeApi.getSpecificationTypes(),
		select(res) {
			return res
		},
	})
	return { data, isLoading: isLoading || isFetching }
}

export const useSpecificationTypeDetail = (id?: string) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["specification-type-detail", `id=${id}`],
		queryFn: () => {
			if (!id) return
			return specificationTypeApi.getSpecificationType(id)
		},
		enabled: !!id,
		select(res) {
			return res
		},
	})
	return { data, isLoading: isLoading || isFetching }
}

export const useCreateSpecificationTypeMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: any) => {
			return specificationTypeApi.createSpecificationType(data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["specification-types"] })
			toast.success("Specification type created successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to create specification type")
		},
	})
}

export const useUpdateSpecificationTypeMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: any) => {
			const { id, ...rest } = data
			return specificationTypeApi.updateSpecificationType(id, rest)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["specification-types"] })
			toast.success("Specification type updated successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to update specification type")
		},
	})
}

export const useDeleteSpecificationTypeMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ id }: { id: string }) => {
			return specificationTypeApi.deleteSpecificationType(id)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["specification-types"] })
			toast.success("Specification type deleted successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to delete specification type")
		},
	})
}
