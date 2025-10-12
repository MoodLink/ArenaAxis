import { Router } from "express";
const router = Router();

// import { index } from "../controllers/task.controller";

router.get("/", (req, res) => {
  res.send("Order Service is running");
});

export default router;
