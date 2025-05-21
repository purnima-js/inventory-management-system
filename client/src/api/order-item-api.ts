import axiosPrivate from "./axios";
import type { OrderItemInput, UpdateOrderItemInput } from "../types";

export const getAllOrderItemsFn = async () => {
  const response = await axiosPrivate.get("/orderItems");
  return response.data;
};

export const getOrderItemByIdFn = async (id: string) => {
  const response = await axiosPrivate.get(`/orderItems/${id}`);
  return response.data;
};

export const addToOrderFn = async (orderItemData: OrderItemInput) => {
  const response = await axiosPrivate.post("/orderItems/add", orderItemData);
  return response.data;
};

export const updateOrderItemFn = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateOrderItemInput;
}) => {
  const response = await axiosPrivate.put(`/orderItems/update/${id}`, data);
  return response.data;
};

export const removeOrderItemFn = async (id: string) => {
  const response = await axiosPrivate.delete(`/orderItems/delete/${id}`);
  return response.data;
};
