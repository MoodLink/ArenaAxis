import { Router } from "express";
const router = Router();

import { create } from "../controllers/field.controller.js";
import { getFields } from "../controllers/field.controller.js";
import { getFieldDetail } from "../controllers/field.controller.js";
import { update } from "../controllers/field.controller.js";
import { remove } from "../controllers/field.controller.js";
import { getStore } from "../controllers/field.controller.js";
import { validateField } from "../validation/field.validate.js";
import { validateUpdateField } from "../validation/field.validate.js";

router.get("/", getFields);
router.get("/store", getStore);
router.get("/:field_id", getFieldDetail);
router.post("/", validateField, create);
router.patch("/:field_id", validateUpdateField, update);
router.delete("/:field_id", remove);

export default router;
