"use client"

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useUser } from "../hooks/useAuth"
import LoadingSpinner from "./LoadingSpinner"

const PublicRoute = () => {
  const { data: user, isLoading } = useUser()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/dashboard"

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Navigate to={from} replace />
  }

  return <Outlet />
}

export default PublicRoute
