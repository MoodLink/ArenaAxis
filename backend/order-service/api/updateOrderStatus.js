import { Order } from "../src/models/order.model.js";
import { connect } from "../src/config/database.js";

export default async function handler(req, res) {
  try {
    await connect();

    const fiveMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    const result = await Order.updateMany(
      {
        statusPayment: "PENDING",
        createdAt: { $lt: fiveMinutesAgo },
      },
      { $set: { statusPayment: "FAILED" } }
    );

    res.status(200).json({
      success: true,
      modified: result.modifiedCount,
    });
  } catch (err) {
    console.error("Cron API error:", err);
    res.status(500).json({ error: err.message });
  }
}
