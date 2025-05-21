import axiosPrivate from "./axios"
import type { DiscountInput } from "../types"

export const getAllDiscountsFn = async () => {
  const response = await axiosPrivate.get("/discounts")
  return response.data
}

export const getDiscountByIdFn = async (id: string) => {
  const response = await axiosPrivate.get(`/discounts/${id}`)
  return response.data
}

export const createDiscountFn = async (discountData: DiscountInput) => {
  const response = await axiosPrivate.post("/discounts/create", discountData)
  return response.data
}

export const updateDiscountFn = async ({ id, data }: { id: string; data: DiscountInput }) => {
  const response = await axiosPrivate.put(`/discounts/update/${id}`, data)
  return response.data
}

export const deleteDiscountFn = async (id: string) => {
  const response = await axiosPrivate.delete(`/discounts/delete/${id}`)
  return response.data
}

export const applyDiscountFn = async (code: string) => {
  const response = await axiosPrivate.post("/discounts/apply", { code })
  return response.data
}
