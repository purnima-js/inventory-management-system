import type { ApiResponse, Order, OrderInput } from "../types"
import axiosPrivate from "./axios"

export const createOrder = async (orderData: OrderInput): Promise<ApiResponse<Order>> => {
  const response = await axiosPrivate.post("/orders/add", orderData)
  return response.data
}

export const getAllOrders = async (): Promise<ApiResponse<Order[]>> => {
  const response = await axiosPrivate.get("/orders")
  return response.data
}

export const getOrderById = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await axiosPrivate.get(`/orders/${id}`)
  return response.data
}

export const updateOrderStatus = async (id: string, status: string): Promise<ApiResponse<Order>> => {
  const response = await axiosPrivate.put(`/orders/update-status/${id}`, { status })
  return response.data
}

export const updatePaymentStatus = async (id: string, isPaid: boolean): Promise<ApiResponse<Order>> => {
  const response = await axiosPrivate.put(`/orders/update-payment/${id}`, { isPaid })
  return response.data
}

export const deleteOrder = async (id: string): Promise<ApiResponse<Order>> => {
  const response = await axiosPrivate.delete(`/orders/delete/${id}`)
  return response.data
}
