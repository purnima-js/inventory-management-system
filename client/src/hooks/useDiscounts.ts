import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import {
  getAllDiscountsFn,
  getDiscountByIdFn,
  createDiscountFn,
  updateDiscountFn,
  deleteDiscountFn,
  applyDiscountFn,
} from "../api/discount-api"
import type { Discount, DiscountInput } from "../types"
import toast from "react-hot-toast"

export const useDiscounts = () => {
  return useQuery({
    queryKey: ["discounts"],
    queryFn: async () => {
      const response = await getAllDiscountsFn()
      return response.data as Discount[]
    },
  })
}

export const useDiscount = (id: string) => {
  return useQuery({
    queryKey: ["discounts", id],
    queryFn: async () => {
      const response = await getDiscountByIdFn(id)
      return response.data as Discount
    },
    enabled: !!id,
  })
}

export const useCreateDiscount = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (data: DiscountInput) => createDiscountFn(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] })
      toast.success(data.message || "Discount created successfully")
      navigate("/discounts")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to create discount")
    },
  })
}

export const useUpdateDiscount = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DiscountInput }) => updateDiscountFn({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] })
      toast.success(data.message || "Discount updated successfully")
      navigate("/discounts")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to update discount")
    },
  })
}

export const useDeleteDiscount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteDiscountFn(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["discounts"] })
      toast.success(data.message || "Discount deleted successfully")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to delete discount")
    },
  })
}

export const useApplyDiscount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (code: string) => applyDiscountFn(code),
    onSuccess: (data) => {
      toast.success(data.message || "Discount applied successfully")
      queryClient.invalidateQueries({
        queryKey: ["discounts"],
      });
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to apply discount")
    },
  })
}
