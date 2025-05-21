import mongoose, { Schema } from "mongoose";

const DiscountSchema = new Schema(
  {
    code: { type: String, required: true, upperCase: true },
    percentage: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Discount = mongoose.model("Discount", DiscountSchema);
