import { mongoose } from "mongoose";

const orderDetailSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    fieldId: { type: String, required: true },
    startTime: { type: Date, required: true },
    storeId: { type: String, index: false },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

orderDetailSchema.index({
  storeId: 1,
  startTime: 1,
  endTime: 1,
});

orderDetailSchema.index({ orderId: 1 });

export const OrderDetail = mongoose.model(
  "OrderDetail",
  orderDetailSchema,
  "order-details"
);
