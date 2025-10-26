import { FieldPricing } from "../models/field-pricing.model";

export const createFieldPricing = async (body) => {
  const fieldPricing = new FieldPricing(body);
  const data = await fieldPricing.save();
  return data;
};
