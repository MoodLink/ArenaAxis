import { createFieldPricing } from "../services/field-pricing.service.js";
import { getFieldPricingsByFieldId } from "../services/field-pricing.service.js";
import { createFieldPricingSpecial } from "../services/field-pricing.service.js";
import { getFieldSpecialPricingsByFieldId } from "../services/field-pricing.service.js";

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

// [POST] /field-pricings/special
export const createSpecial = async (req, res) => {
  try {
    const body = {
      fieldId: req.body.field_id,
      startAt: req.body.start_at,
      endAt: req.body.end_at,
      specialPrice: req.body.price,
    };

    const data = await createFieldPricingSpecial(body);
    res
      .status(201)
      .send({ message: "Field special pricing created successfully", data });
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

// [GET] /field-pricings/special/:field_id
export const getSpecialPriceByFieldId = async (req, res) => {
  try {
    const fieldId = req.params.field_id;
    const data = await getFieldSpecialPricingsByFieldId(fieldId);
    if (!data) {
      res.status(404).json({
        message: "No special pricing data found for this field",
      });
    }
    res
      .status(200)
      .send({ message: "Field special pricings retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
