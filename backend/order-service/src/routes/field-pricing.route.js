import { Router } from "express";
const router = Router();

import { create } from "../controllers/field-pricing.controller.js";
import { getPriceByFieldId } from "../controllers/field-pricing.controller.js";
import { validateFieldPricing } from "../validation/field-pricings.validate.js";
import { validateFieldPricingSpecial } from "../validation/field-pricings.validate.js";
import { createSpecial } from "../controllers/field-pricing.controller.js";
import { getSpecialPriceByFieldId } from "../controllers/field-pricing.controller.js";

router.post("/", validateFieldPricing, create);
router.post("/special", validateFieldPricingSpecial, createSpecial);
router.get("/:field_id", getPriceByFieldId);
router.get("/special/:field_id", getSpecialPriceByFieldId);

export default router;
