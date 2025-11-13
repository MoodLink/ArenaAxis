import { PayOS } from "@payos/node";
import dotenv from "dotenv";
dotenv.config();
import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { mergeContinuous } from "../utils/time.util.js";
import { mergeOrderDetails } from "../utils/time.util.js";
import { getStoreDetails } from "./field.service.js";

const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

const RETURN_URL =
  process.env.RETURN_URL || "http://localhost:3000/payment/success";
const CANCEL_URL =
  process.env.CANCEL_URL || "http://localhost:3000/payment/failure";

export const createOrderService = async (paymentData) => {
  try {
    const { amount, description, items, store_id, user_id, date } = paymentData;

    if (
      !amount ||
      !description ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !store_id ||
      !user_id ||
      !date
    ) {
      throw new Error("Missing required fields: amount, description, or items");
    }

    const orderCode = Date.now();

    const order = new Order({
      userId: user_id,
      storeId: store_id,
      statusPayment: "PENDING",
      cost: amount,
      orderCode: orderCode,
    });

    await order.save();
    console.log("Order created with ID:", order._id);

    const orderDetails = items.map((item) => {
      const startDateTime = new Date(`${date}T${item.start_time}:00`);
      const endDateTime = new Date(`${date}T${item.end_time}:00`);

      return OrderDetail({
        orderId: order._id,
        fieldId: item.field_id,
        startTime: startDateTime,
        endTime: endDateTime,
        price: item.price,
      });
    });

    const savedOrderDetails = await OrderDetail.insertMany(orderDetails);
    console.log("OrderDetails saved:", savedOrderDetails);

    const requestDataItems = mergeContinuous(items);

    const requestData = {
      orderCode: orderCode,
      amount: order.cost,
      description,
      items: requestDataItems,
      returnUrl: RETURN_URL + `?orderId=${order._id}`,
      cancelUrl: CANCEL_URL + `?orderId=${order._id}`,
    };

    console.log("Request Data:", requestData);

    const paymentResponse = await payOS.paymentRequests.create(requestData);
    console.log("Payment Response:", paymentResponse);
    const data = {
      orderCode: paymentResponse.orderCode,
      amount: paymentResponse.amount,
      checkoutUrl: paymentResponse.checkoutUrl,
      description: paymentResponse.description,
    };
    console.log("Returning Data:", data);
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const payosWebhookHandler = async (req, res) => {
  try {
    const body = req.body;
    console.log("Webhook Body:", body);

    const { orderCode, amount, code, desc } = body.data;

    const order = await Order.findOne({ orderCode: orderCode });
    if (!order) return res.status(404).send("Order not found");
    order.statusPayment = code === "00" ? "PAID" : "FAILED";
    await order.save();

    console.log(`Cập nhật đơn hàng ${orderCode} thành công`);
    res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderService = async (filter) => {
  try {
    let order = null;
    if (filter.statusPayment) {
      order = await Order.findByIdAndUpdate(
        filter.orderId,
        {
          statusPayment: filter.statusPayment,
        },
        { new: true }
      );
    } else {
      order = await Order.findById(filter.orderId);
    }
    if (!order) {
      throw new Error("Order not found");
    }

    const orderDetails = await OrderDetail.find({ orderId: order._id });
    const plainDetails = orderDetails.map((item) => item.toObject());
    const mergedDetails = mergeOrderDetails(plainDetails);
    order._doc.orderDetails = mergedDetails;

    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getOrdersByStoreService = async (storeId, startTime, endTime) => {
  try {
    const filter = {
      storeId: storeId,
      statusPayment: "PAID",
    };
    if (startTime && endTime) {
      filter.createdAt = {
        $gte: new Date(startTime).setHours(0, 0, 0, 0),
        $lte: new Date(endTime).setHours(23, 59, 59, 999),
      };
    }
    const orders = await Order.find(filter).sort({ createdAt: -1 });

    for (let order of orders) {
      const orderDetails = await OrderDetail.find({ orderId: order._id });
      const plainDetails = orderDetails.map((item) => item.toObject());
      const mergedDetails = mergeOrderDetails(plainDetails);
      order._doc.orderDetails = mergedDetails;
    }

    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getOrdersByUserService = async (userId) => {
  try {
    const orders = await Order.find({
      userId: userId,
      statusPayment: "PAID",
    }).sort({
      createdAt: -1,
    });
    for (let order of orders) {
      const orderDetails = await OrderDetail.find({ orderId: order._id });
      const plainDetails = orderDetails.map((item) => item.toObject());
      const mergedDetails = mergeOrderDetails(plainDetails);
      order._doc.orderDetails = mergedDetails;
    }
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};
