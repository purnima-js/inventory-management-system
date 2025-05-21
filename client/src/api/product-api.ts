import axiosPrivate from "./axios"
import type { ProductInput } from "../types"

export const getAllProductsFn = async () => {
  const response = await axiosPrivate.get("/products")
  return response.data
}

export const getProductByIdFn = async (id: string) => {
  const response = await axiosPrivate.get(`/products/${id}`)
  return response.data
}

export const createProductFn = async (productData: ProductInput) => {
  // Create FormData for file upload
  const formData = new FormData()

  // Append all product data to FormData
  Object.entries(productData).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })

  const response = await axiosPrivate.post("/products/create-product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const updateProductFn = async ({ id, data }: { id: string; data: ProductInput }) => {
  // Create FormData for file upload
  const formData = new FormData()

  // Append all product data to FormData
  Object.entries(data).forEach(([key, value]) => {
    if (key === "image" && value instanceof File) {
      formData.append(key, value)
    } else {
      formData.append(key, String(value))
    }
  })

  const response = await axiosPrivate.put(`/products/update-product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })

  return response.data
}

export const deleteProductFn = async (id: string) => {
  const response = await axiosPrivate.delete(`/products/delete-product/${id}`)
  return response.data
}
