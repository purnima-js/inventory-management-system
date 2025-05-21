import axiosPrivate from "./axios"
import type { CategoryInput } from "../types"

export const getAllCategoriesFn = async () => {
  const response = await axiosPrivate.get("/categories")
  return response.data
}

export const getCategoryByIdFn = async (id: string) => {
  const response = await axiosPrivate.get(`/categories/${id}`)
  return response.data
}

export const createCategoryFn = async (categoryData: CategoryInput) => {
  const response = await axiosPrivate.post("/categories/create-category", categoryData)
  return response.data
}

export const updateCategoryFn = async ({ id, data }: { id: string; data: CategoryInput }) => {
  const response = await axiosPrivate.put(`/categories/update-category/${id}`, data)
  return response.data
}

export const deleteCategoryFn = async (id: string) => {
  const response = await axiosPrivate.delete(`/categories/delete-category/${id}`)
  return response.data
}
