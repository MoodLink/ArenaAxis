import { createOrderService } from "../services/order.service.js";
import { getOrderService } from "../services/order.service.js";

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
    const orderId = req.params.order_id;
    const data = await getOrderService(orderId);
    res.status(200).send({ message: "Order retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
