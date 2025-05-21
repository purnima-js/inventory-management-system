"use client";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const { data: user, isLoading } = useUser();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
