"use client";

import { useParams, Link } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import {
  ArrowLeft,
  CreditCard,
  Banknote,
  Package,
  Check,
  X,
  Truck,
  CheckCircle,
} from "lucide-react";
import { OrderItem } from "../types";
import { useOrder } from "../hooks/useOrder";

const statusIcons = {
  PENDING: <Package className="h-5 w-5" />,
  CONFIRMED: <Check className="h-5 w-5" />,
  SHIPPED: <Truck className="h-5 w-5" />,
  DELIVERED: <CheckCircle className="h-5 w-5" />,
  CANCELLED: <X className="h-5 w-5" />,
};

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useOrder(id || "");

  if (isLoading || !data) {
    return <LoadingSpinner />;
  }

  const order = data.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="flex items-center text-indigo-600 hover:text-indigo-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Summary */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">{order._id.substring(0, 12)}...</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    statusColors[order.status as keyof typeof statusColors]
                  }`}
                >
                  {statusIcons[order.status as keyof typeof statusIcons]}
                  <span className="ml-1">{order.status}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Payment</p>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.isPaid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span>{order.isPaid ? "Paid" : "Unpaid"}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="space-y-4">
                {Array.isArray(order.orderItems) &&
                  (order.orderItems as OrderItem[]).map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                    >
                      {item.product && (
                        <>
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={
                                typeof item.product === "object"
                                  ? item.product.image
                                  : "/placeholder.svg"
                              }
                              alt={
                                typeof item.product === "object"
                                  ? item.product.name
                                  : "Product"
                              }
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h4>
                                {typeof item.product === "object"
                                  ? item.product.name
                                  : "Product"}
                              </h4>
                              <p className="ml-4">
                                ${item.price?.toFixed(2) || "0.00"}
                              </p>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                              <p>Qty: {item.quantity}</p>
                              <p>
                                Subtotal: $
                                {(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer and Payment Info */}
        <div className="md:col-span-1">
          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Customer</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Email: </span>
                {typeof order.customer === "object" && order.customer.email
                  ? order.customer.email
                  : "N/A"}
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Customer ID: </span>
                {typeof order.customer === "object" && order.customer._id
                  ? order.customer._id
                  : typeof order.customer === "string"
                  ? order.customer
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <div className="space-y-2">
              <p className="flex items-center text-sm">
                <span className="text-gray-500 mr-1">Method: </span>
                {order.paymentType === "CARD" ? (
                  <span className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-1 text-gray-500" /> Card
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Banknote className="h-4 w-4 mr-1 text-gray-500" /> Cash
                  </span>
                )}
              </p>
              {order.paymentId && (
                <p className="text-sm">
                  <span className="text-gray-500">Payment ID: </span>
                  {order.paymentId}
                </p>
              )}
              <p className="text-sm">
                <span className="text-gray-500">Status: </span>
                <span
                  className={order.isPaid ? "text-green-600" : "text-red-600"}
                >
                  {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Order Total</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              {order.discount && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
                  <span className="text-red-600">
                    -$
                    {(
                      order.total - (order.discountedTotal || order.total)
                    ).toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-medium text-base pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span>
                  ${(order.discountedTotal || order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
