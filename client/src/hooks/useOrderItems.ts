import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getAllOrderItemsFn,
  getOrderItemByIdFn,
  addToOrderFn,
  updateOrderItemFn,
  removeOrderItemFn,
} from "../api/order-item-api"
import type { OrderItem, OrderItemInput, UpdateOrderItemInput } from "../types"
import toast from "react-hot-toast"

export const useOrderItems = () => {
  return useQuery({
    queryKey: ["orderItems"],
    queryFn: async () => {
      const response = await getAllOrderItemsFn()
      return response.data as OrderItem[]
    },
  })
}

export const useOrderItem = (id: string) => {
  return useQuery({
    queryKey: ["orderItems", id],
    queryFn: async () => {
      const response = await getOrderItemByIdFn(id)
      return response.data as OrderItem
    },
    enabled: !!id,
  })
}

export const useAddToOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: OrderItemInput) => addToOrderFn(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] })
      toast.success(data.message || "Item added to order successfully")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to add item to order")
    },
  })
}

export const useUpdateOrderItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderItemInput }) => updateOrderItemFn({ id, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] })
      toast.success(data.message || "Order item updated successfully")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to update order item")
    },
  })
}

export const useRemoveOrderItem = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => removeOrderItemFn(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orderItems"] })
      toast.success(data.message || "Item removed from order successfully")
    },
    onError: (error: {message:string}) => {
      toast.error(error.message || "Failed to remove item from order")
    },
  })
}
