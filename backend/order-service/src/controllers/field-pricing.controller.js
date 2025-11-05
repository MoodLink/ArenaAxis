import { createFieldPricing } from "../services/field-pricing.service.js";
import { getFieldPricingsByFieldId } from "../services/field-pricing.service.js";

// [POST] /field-pricings/create
export const create = async (req, res) => {
  try {
    const body = {
      fieldId: req.body.field_id,
      dayOfWeeks: req.body.day_of_weeks,
      startAt: req.body.start_at,
      endAt: req.body.end_at,
      specialPrice: req.body.price,
    };

    const data = await createFieldPricing(body);
    res
      .status(201)
      .send({ message: "Field pricing created successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [GET] /field-pricings/:field_id
export const getPriceByFieldId = async (req, res) => {
  try {
    const fieldId = req.params.field_id;
    const data = await getFieldPricingsByFieldId(fieldId);
    if (!data) {
      res.status(404).json({
        message: "No pricing data found for this field",
      });
    }
    res
      .status(200)
      .send({ message: "Field pricings retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
