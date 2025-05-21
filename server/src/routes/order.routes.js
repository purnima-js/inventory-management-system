import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

// Create a new order
router.route("/add").post(createOrder);

// Get all orders
router.get("/", getAllOrders);

// Get order by ID
router.get("/:orderId", getOrderById);

// Update order (status, isPaid, paymentId)
router.put("/update/:orderId", updateOrder);

// Delete order
router.delete("/delete/:orderId", deleteOrder);

export default router;
