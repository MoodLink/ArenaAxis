import { createOrderService } from "../services/order.service.js";
import { getOrderService } from "../services/order.service.js";
import { getOrdersByStoreService } from "../services/order.service.js";
import { getOrdersByUserService } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const paymentData = req.body;
    const data = await createOrderService(paymentData);
    res.status(200).send({ message: "Order created successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const filter = {};
    const orderId = req.params.order_id;
    filter.orderId = orderId;
    const statusPayment = req.query.status_payment;
    if (statusPayment) filter.statusPayment = statusPayment;
    const data = await getOrderService(filter);
    res.status(200).send({ message: "Order retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getOrdersByStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;
    const startTime = req.query.start_time;
    const endTime = req.query.end_time;
    const playDateStart = req.query.play_date_start;
    const playDateEnd = req.query.play_date_end;
    const data = await getOrdersByStoreService(storeId, startTime, endTime, playDateStart, playDateEnd);
    res.status(200).send({ message: "Orders retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const data = await getOrdersByUserService(userId);
    res.status(200).send({ message: "Orders retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
