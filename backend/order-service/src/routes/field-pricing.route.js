import { Router } from "express";
const router = Router();

import { create } from "../controllers/field-pricing.controller.js";
import { getPriceByFieldId } from "../controllers/field-pricing.controller.js";
import { validateFieldPricing } from "../validation/field-pricings.validate.js";

router.post("/", validateFieldPricing, create);
router.get("/:field_id", getPriceByFieldId);

export default router;
