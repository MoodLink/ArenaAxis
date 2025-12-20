import { Router } from "express";
const router = Router();
import { getRevenue } from "../controllers/revenue.controller.js";
import { getRevenueOfStore } from "../controllers/revenue.controller.js";

router.get("/:owner_id", getRevenue);
router.get("/store/:store_id", getRevenueOfStore);

export default router;
