import { Router } from "express";
const router = Router();

import { create } from "../controllers/field.controller.js";

router.post("/create", create);

export default router;
