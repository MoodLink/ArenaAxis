import { mongoose } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    storeId: { type: String, required: true },
    statusPayment: { type: String, required: true },
    cost: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    orderCode: { type: String, required: true, unique: true },
    isRated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema, "orders");
