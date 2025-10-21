import { mongoose } from "mongoose";

const orderDetailSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    fieldId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

export const OrderDetail = mongoose.model(
  "OrderDetail",
  orderDetailSchema,
  "order-details"
);
