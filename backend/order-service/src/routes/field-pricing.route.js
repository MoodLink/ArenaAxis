import { Router } from "express";
const router = Router();

import { create } from "../controllers/field-pricing.controller.js";

router.post("/create", create);

export default router;
