import { brandApi } from "@/lib/api/brand.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { toast } from "sonner"

export const useBrands = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["brands"],
		queryFn: () => brandApi.getBrands(),
		select(res) {
			return res.data
		},
	})

	const brands = useMemo(() => {
		if (Array.isArray(data)) {
			return data.map((item) => ({
				...item
			}))
		} else {
			return []
		}
	}, [data])

	return { data: brands, isLoading: isLoading || isFetching }
}

export const useBrandDetail = (id?: string) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["brand-detail", `id=${id}`],
		queryFn: () => {
			if (!id) return
			return brandApi.getBrand(id)
		},
		enabled: !!id,
		select(res) {
			return res?.data
		},
	})
	return { data, isLoading: isLoading || isFetching }
}

export const useCreateBrandMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: any) => {
			return brandApi.createBrand(data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["brands"] })
			toast.success("Brand created successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to create brand")
		},
	})
}

export const useUpdateBrandMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: any) => {
			const { id, ...rest } = data
			return brandApi.updateBrand(id, rest)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["brands"] })
			toast.success("Brand updated successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to update brand")
		},
	})
}

export const useDeleteBrandMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ id }: { id: string }) => {
			return brandApi.deleteBrand(id)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["brands"] })
			toast.success("Brand deleted successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to delete brand")
		},
	})
}
