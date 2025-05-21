"use client";

import { useState } from "react";

import { useProducts } from "../hooks/useProducts";

import {
  BarChart2,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useReports } from "../hooks/useReport";
import { useOrders } from "../hooks/useOrder";

// Colors for charts
const COLORS = [
  "#4f46e5",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

const Reports = () => {
  const { data: reportData, isLoading: isLoadingReports } = useReports();
  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const { data: ordersData, isLoading: isLoadingOrders } = useOrders();

  const [dateRange, setDateRange] = useState<"week" | "month" | "year">(
    "month"
  );

  if (isLoadingReports || isLoadingProducts || isLoadingOrders) {
    return <LoadingSpinner />;
  }

  const products = productsData || [];
  const orders = ordersData?.data || [];

  // Calculate totals
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.discountedTotal || order.total),
    0
  );

  // Get unique customers
  const uniqueCustomers = new Set(
    orders.map((order) =>
      typeof order.customer === "object" && order.customer._id
        ? order.customer._id
        : order.customer
    )
  ).size;

  // Prepare data for charts
  const orderStatusData = [
    {
      name: "Pending",
      value: orders.filter((order) => order.status === "PENDING").length,
    },
    {
      name: "Confirmed",
      value: orders.filter((order) => order.status === "CONFIRMED").length,
    },
    {
      name: "Shipped",
      value: orders.filter((order) => order.status === "SHIPPED").length,
    },
    {
      name: "Delivered",
      value: orders.filter((order) => order.status === "DELIVERED").length,
    },
    {
      name: "Cancelled",
      value: orders.filter((order) => order.status === "CANCELLED").length,
    },
  ].filter((item) => item.value > 0);

  const paymentTypeData = [
    {
      name: "Cash",
      value: orders.filter((order) => order.paymentType === "CASH").length,
    },
    {
      name: "Card",
      value: orders.filter((order) => order.paymentType === "CARD").length,
    },
  ];

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const categoryName =
      typeof product.category === "object"
        ? product.category.name
        : product.category.toString();

    if (!acc[categoryName]) {
      acc[categoryName] = 0;
    }
    acc[categoryName]++;
    return acc;
  }, {} as Record<string, number>);

  const productCategoryData = Object.entries(productsByCategory).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Use mock data for sales trend
  const salesTrendData = reportData?.monthlySales || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2 h-6 w-6" />
          Reports & Analytics
        </h1>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              dateRange === "week"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setDateRange("week")}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              dateRange === "month"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setDateRange("month")}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-md ${
              dateRange === "year"
                ? "bg-indigo-100 text-indigo-700"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setDateRange("year")}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 flex items-center">
          <div className="rounded-full bg-indigo-100 p-3 mr-4">
            <Package className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold">{totalProducts}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center">
          <div className="rounded-full bg-green-100 p-3 mr-4">
            <ShoppingCart className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center">
          <div className="rounded-full bg-yellow-100 p-3 mr-4">
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="card p-4 flex items-center">
          <div className="rounded-full bg-purple-100 p-3 mr-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Customers</p>
            <p className="text-2xl font-bold">{uniqueCustomers}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 h-5 w-5" />
            Sales Trend
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={salesTrendData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value}`, "Sales"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#4f46e5"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Order Status
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} orders`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Products by Category */}
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Products by Category
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={productCategoryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Products" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Types */}
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Payment Methods
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {paymentTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} orders`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
