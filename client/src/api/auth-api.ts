import { axiosPublic, axiosPrivate } from "./axios";
import type { User, LoginCredentials, RegisterCredentials } from "../types";

export const loginFn = async (credentials: LoginCredentials) => {
  const response = await axiosPublic.post("/users/login", credentials);
  return response.data;
};

export const registerFn = async (userData: RegisterCredentials) => {
  const response = await axiosPublic.post("/users/register", userData);
  return response.data;
};

export const logoutFn = async () => {
  const response = await axiosPrivate.get("/users/logout");
  return response.data;
};

export const getCurrentUserFn = async (): Promise<{ data: User }> => {
  const response = await axiosPublic.get("/users/me");
  return response.data;
};

export const refreshTokenFn = async () => {
  // This endpoint is inferred from your Postman collection
  // You might need to adjust it based on your actual API
  const response = await axiosPublic.get("/users/refresh-token");
  return response.data;
};
