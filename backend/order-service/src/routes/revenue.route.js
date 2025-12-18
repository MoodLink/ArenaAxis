import { Router } from "express";
const router = Router();
import { getRevenue } from "../controllers/revenue.controller.js";

router.get("/:owner_id", getRevenue);

export default router;
