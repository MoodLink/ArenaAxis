import { Router } from "express";
const router = Router();

import { createOrder } from "../controllers/order.controller.js";

router.post("/create-payment", createOrder);
router.get("/success", (req, res) => {
  res.send("Payment successful!");
});
router.get("/cancel", (req, res) => {
  res.send("Payment canceled.");
});

export default router;
