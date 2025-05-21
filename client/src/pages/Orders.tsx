"use client";

import { useState } from "react";
import {
  useOrders,
  useUpdateOrderStatus,
  useUpdatePaymentStatus,
} from "../hooks/useOrder";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Truck,
  Package,
  CheckCircle,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Order } from "../types";

const statusIcons = {
  PENDING: <Package className="h-5 w-5 text-yellow-500" />,
  CONFIRMED: <Check className="h-5 w-5 text-blue-500" />,
  SHIPPED: <Truck className="h-5 w-5 text-purple-500" />,
  DELIVERED: <CheckCircle className="h-5 w-5 text-green-500" />,
  CANCELLED: <X className="h-5 w-5 text-red-500" />,
};

console.log(statusIcons);

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const Orders = () => {
  const { data, isLoading } = useOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  const updatePaymentStatus = useUpdatePaymentStatus();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [paymentFilter, setPaymentFilter] = useState<string | null>(null);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const orders = data?.data || [];

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter((order: Order) => {
    const matchesSearch =
      searchTerm === "" ||
      (typeof order.customer === "object" &&
        order.customer.email &&
        order.customer.email
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === null || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === null ||
      (paymentFilter === "PAID" && order.isPaid) ||
      (paymentFilter === "UNPAID" && !order.isPaid);

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus.mutate({ id: orderId, status: newStatus });
  };

  const handlePaymentStatusChange = (orderId: string, isPaid: boolean) => {
    updatePaymentStatus.mutate({ id: orderId, isPaid });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center">
          <ClipboardList className="mr-2 h-6 w-6" />
          Orders
        </h1>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="form-input pl-10"
              placeholder="Search by email or order ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="form-select pl-10"
              value={statusFilter || ""}
              onChange={(e) => setStatusFilter(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="form-select pl-10"
              value={paymentFilter || ""}
              onChange={(e) => setPaymentFilter(e.target.value || null)}
            >
              <option value="">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="card overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order: Order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {typeof order.customer === "object" && order.customer.email
                      ? order.customer.email
                      : "Unknown"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    $
                    {order.discountedTotal
                      ? order.discountedTotal.toFixed(2)
                      : order.total.toFixed(2)}
                    {order.discountedTotal && (
                      <span className="ml-1 line-through text-xs text-gray-400">
                        ${order.total.toFixed(2)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`text-xs font-medium px-2.5 py-1 rounded ${
                        statusColors[order.status as keyof typeof statusColors]
                      }`}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      className={`text-xs font-medium px-2.5 py-1 rounded ${
                        order.isPaid
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      value={order.isPaid ? "PAID" : "UNPAID"}
                      onChange={(e) =>
                        handlePaymentStatusChange(
                          order._id,
                          e.target.value === "PAID"
                        )
                      }
                    >
                      <option value="PAID">Paid</option>
                      <option value="UNPAID">Unpaid</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card text-center py-8">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No orders found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter || paymentFilter
              ? "Try adjusting your filters"
              : "Start creating orders to see them here"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Orders;
