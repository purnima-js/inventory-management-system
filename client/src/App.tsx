import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loaded components
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Products = lazy(() => import("./pages/Products"));
const Categories = lazy(() => import("./pages/Categories"));
const AddProduct = lazy(() => import("./pages/AddProduct"));
const AddCategory = lazy(() => import("./pages/AddCategory"));
const EditProduct = lazy(() => import("./pages/EditProduct"));
const EditCategory = lazy(() => import("./pages/EditCategory"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderItems = lazy(() => import("./pages/OrderItems"));
const Discounts = lazy(() => import("./pages/Discounts"));
const AddDiscount = lazy(() => import("./pages/AddDiscount"));
const EditDiscount = lazy(() => import("./pages/EditDiscount"));

// Orders components
const Orders = lazy(() => import("./pages/Orders"));
const OrderDetail = lazy(() => import("./pages/OrderDetail"));

// Reports component
const Reports = lazy(() => import("./pages/Reports"));

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/products/edit/:id" element={<EditProduct />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/add" element={<AddCategory />} />
              <Route path="/categories/edit/:id" element={<EditCategory />} />
              <Route path="/order-items" element={<OrderItems />} />
              <Route path="/discounts" element={<Discounts />} />
              <Route path="/discounts/add" element={<AddDiscount />} />
              <Route path="/discounts/edit/:id" element={<EditDiscount />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<OrderDetail />} />

              {/* Reports Route */}
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
