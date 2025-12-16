import cron from "node-cron";
import { Order } from "../models/order.model.js";

cron.schedule("*/10 * * * * *", async () => {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);

    const result = await Order.updateMany(
      {
        statusPayment: "PENDING",
        createdAt: { $lt: fiveMinutesAgo },
      },
      { $set: { statusPayment: "FAILED" } }
    );

    console.log("Cron cập nhật: " + new Date().toISOString());

    if (result.modifiedCount > 0) {
      console.log(
        `Đã cập nhật ${result.modifiedCount} đơn hàng hết hạn thành FAILED`
      );
    }
  } catch (error) {
    console.error("Cron job cập nhật FAILED gặp lỗi:", error);
  }
});
