import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  getAllCategoriesFn,
  getCategoryByIdFn,
  createCategoryFn,
  updateCategoryFn,
  deleteCategoryFn,
} from "../api/category-api"
import type { Category, CategoryInput } from "../types"
import toast from "react-hot-toast"

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getAllCategoriesFn()
      return response.data as Category[]
    },
  })
}

export const useCategory = (id: string) => {
  return useQuery({
    queryKey: ["categories", id],
    queryFn: async () => {
      const response = await getCategoryByIdFn(id)
      return response.data as Category
    },
    enabled: !!id,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: CategoryInput) => createCategoryFn(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(data.message || "Category created successfully")
      navigate("/categories")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to create category")
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryInput }) => updateCategoryFn({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(data.message || "Category updated successfully")
      navigate("/categories")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to update category")
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteCategoryFn(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast.success(data.message || "Category deleted successfully")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to delete category")
    },
  })
}
