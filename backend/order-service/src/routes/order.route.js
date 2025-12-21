import { Router } from "express";
import express from "express";
const router = Router();

import { createOrder } from "../controllers/order.controller.js";
import { payosWebhookHandler } from "../services/order.service.js";
import { orderServices } from "../container/container.service.js";
import { getOrder } from "../controllers/order.controller.js";
import { getOrdersByStore } from "../controllers/order.controller.js";
import { getOrdersByUser } from "../controllers/order.controller.js";

router.post("/create-payment", createOrder);
router.post("/webhook", express.json(), orderServices.payosWebhookHandler);
router.get("/store/:store_id", getOrdersByStore);
router.get("/user/:user_id", getOrdersByUser);
router.get("/:order_id", getOrder);
router.get("/success", (req, res) => {
  res.send("Payment successful!");
});
router.get("/cancel", (req, res) => {
  res.send("Payment canceled.");
});

export default router;
