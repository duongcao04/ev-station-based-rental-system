import { categoryApi } from "@/lib/api/category.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMemo } from "react"
import { toast } from "sonner"

export const useCategories = () => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["categories"],
		queryFn: () => categoryApi.getCategories(),
		select(res) {
			return res
		},
	})
	const categories = useMemo(() => {
		if (Array.isArray(data)) {
			return data.map((item) => ({
				...item
			}))
		} else {
			return []
		}
	}, [data])
	return { data: categories, isLoading: isLoading || isFetching }
}

export const useCategoryDetail = (id?: string) => {
	const { data, isLoading, isFetching } = useQuery({
		queryKey: ["category-detail", `id=${id}`],
		queryFn: () => {
			if (!id) return
			return categoryApi.getCategory(id)
		},
		enabled: !!id,
		select(res) {
			return res
		},
	})
	return { data, isLoading: isLoading || isFetching }
}

export const useCreateCategoryMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: any) => {
			return categoryApi.createCategory(data)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] })
			toast.success("Category created successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to create category")
		},
	})
}

export const useUpdateCategoryMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async (data: any) => {
			const { id, ...rest } = data
			return categoryApi.updateCategory(id, rest)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] })
			toast.success("Category updated successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to update category")
		},
	})
}

export const useDeleteCategoryMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({ id }: { id: string }) => {
			return categoryApi.deleteCategory(id)
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["categories"] })
			toast.success("Category deleted successfully")
		},
		onError: (error) => {
			console.error(error)
			toast.error("Failed to delete category")
		},
	})
}
