import { createFieldPricing } from "../services/field-pricing.service.js";

// [POST] /field-pricings/create
export const create = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
