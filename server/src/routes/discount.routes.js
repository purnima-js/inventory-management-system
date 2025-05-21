import { Router } from "express";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
  getAllDiscounts,
  getDiscountById,
} from "../controllers/discount.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.route("/").get(getAllDiscounts);
router.route("/create").post(createDiscount);
router.route("/update/:discountId").put(updateDiscount);
router.route("/delete/:discountId").delete(deleteDiscount);
router.route("/:discountId").get(getDiscountById);

export default router;
