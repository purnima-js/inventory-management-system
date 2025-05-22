import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { Order } from "../models/order.models.js";
import { Discount } from "../models/discount.models.js";
import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import { OrderItem } from "../models/orderItem.models.js";

// Create Order
const createOrder = asyncHandler(async (req, res) => {
  const { customer, orderItems, paymentType, discountCode, total,isPaid } = req.body;

  if (
    !customer ||
    !orderItems ||
    !Array.isArray(orderItems) ||
    orderItems.length === 0 ||
    !paymentType ||
    total == null
  ) {
    throw new ApiError(400, "Please provide all required fields");
  }

  for (const item of orderItems) {
    if (!mongoose.Types.ObjectId.isValid(item)) {
      throw new ApiError(400, `Invalid orderItem ID: ${item}`);
    }
  }
  let discount = null;
  let discountedTotal = total;

  // Apply discount if code provided
  if (discountCode) {
    discount = await Discount.findOne({
      code: discountCode.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
    });
    if (!discount) {
      throw new ApiError(400, "Invalid or expired discount code");
    }
    discountedTotal = total - (total * discount.percentage) / 100;
  }
  

  const order = await Order.create({
    total,
    discountedTotal,
    customer: customer,
    discount: discount ? discount._id : null,
    paymentType,
    orderItems: orderItems.map((item) => item),
    status: isPaid ? "CONFIRMED" : "PENDING",
    isPaid:isPaid ,
  });

  if (!order) {
    throw new ApiError(500, "Failed to create order");
  }

  // Decrement product stock for each order item (after order is created)
  const orderItemDocs = await OrderItem.find({
    _id: { $in: order.orderItems },
  });
  for (const orderItem of orderItemDocs) {
    await Product.findByIdAndUpdate(orderItem.product, {
      $inc: { stock: -orderItem.quantity },
    });
  }

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .populate("customer", "name email")
    .populate("orderItems")
    .populate("discount")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) throw new ApiError(400, "Order ID required");
  const order = await Order.findById(orderId)
    .populate("customer", "name email")
     .populate({
    path: "orderItems",
    populate: {
      path: "product",
    },
  })
    .populate("discount");
  
  if (!order) throw new ApiError(404, "Order not found");
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Update order (status, isPaid, paymentId)
const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, isPaid, paymentId } = req.body;
  if (!orderId) throw new ApiError(400, "Order ID required");

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: { status, isPaid, paymentId } },
    { new: true }
  );
  if (!order) throw new ApiError(404, "Order not found");
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order updated successfully"));
});

// Delete order
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  if (!orderId) throw new ApiError(400, "Order ID required");
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) throw new ApiError(404, "Order not found");
  res
    .status(200)
    .json(new ApiResponse(200, order, "Order deleted successfully"));
});

export { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
