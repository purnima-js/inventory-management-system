import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  getAllProductsFn,
  getProductByIdFn,
  createProductFn,
  updateProductFn,
  deleteProductFn,
} from "../api/product-api"
import type { Product, ProductInput } from "../types"
import toast from "react-hot-toast"

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await getAllProductsFn()
      return response.data as Product[]
    },
  })
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ["products", id],
    queryFn: async () => {
      const response = await getProductByIdFn(id)
      return response.data as Product
    },
    enabled: !!id,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: ProductInput) => createProductFn(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(data.message || "Product created successfully")
      navigate("/products")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to create product")
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductInput }) => updateProductFn({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(data.message || "Product updated successfully")
      navigate("/products")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to update product")
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteProductFn(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      toast.success(data.message || "Product deleted successfully")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to delete product")
    },
  })
}
