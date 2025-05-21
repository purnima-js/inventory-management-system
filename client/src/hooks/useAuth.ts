import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  loginFn,
  registerFn,
  logoutFn,
  getCurrentUserFn,
} from "../api/auth-api";
import type { LoginCredentials, RegisterCredentials, User } from "../types";
import toast from "react-hot-toast";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginFn(credentials),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.data);
      toast.success(data.message || "Login successful");
      navigate("/dashboard");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Login failed");
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: RegisterCredentials) => registerFn(userData),
    onSuccess: (data) => {
      toast.success(data.message || "Registration successful");
      navigate("/login");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Registration failed");
      console.log(error.message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      toast.success(data.message || "Logout successful");
      navigate("/login");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Logout failed");
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await getCurrentUserFn();
      return response.data as User;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  });
};
