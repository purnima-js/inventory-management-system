import axios from "axios"
import { refreshTokenFn } from "./auth-api"

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000"

export const axiosPublic = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const axiosPrivate = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

// Response interceptor for handling token refresh
axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Attempt to refresh the token
        await refreshTokenFn()

        // Retry the original request
        return axiosPrivate(originalRequest)
      } catch (refreshError) {
        // If refresh fails, redirect to login
        window.location.href = "/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosPrivate
