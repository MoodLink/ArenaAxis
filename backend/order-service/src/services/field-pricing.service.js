import { FieldPricing } from "../models/field-pricing.model.js";
import { Field } from "../models/field.model.js";
import { generateDurations } from "../utils/time.util.js";
import { joinDurations } from "../utils/time.util.js";
import { daysOfWeekEnum } from "../models/field-pricing.model.js";

export const createFieldPricing = async (body) => {
  try {
    const { startAt, endAt } = body;
    body.durations = generateDurations(startAt, endAt);
    body.dayOfWeeks = body.dayOfWeeks.map((day) => day.toLowerCase());
    const results = [];
    for (const dayOfWeek of body.dayOfWeeks) {
      for (const duration of body.durations) {
        await FieldPricing.findOneAndUpdate(
          {
            fieldId: body.fieldId,
            dayOfWeek,
            startAt: duration.startAt,
            endAt: duration.endAt,
            deletedAt: null,
          },
          { deletedAt: new Date() },
          { new: true }
        );

        const newPricing = await FieldPricing.create({
          fieldId: body.fieldId,
          specialPrice: body.specialPrice,
          dayOfWeek,
          startAt: duration.startAt,
          endAt: duration.endAt,
        });
        results.push(newPricing);
      }
    }
  } catch (error) {
    console.error("Error in createFieldPricing:", {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    throw error;
  }
};

export const getFieldPricingsByFieldId = async (fieldId) => {
  try {
    const field = await Field.findById(fieldId).lean();
    if (!field) {
      throw new Error("Field not found");
    }

    const defaultPrice = field.defaultPrice;
    // get price from monday to sunday, if not found, use default price
    const pricings = {};
    for (const day of Object.values(daysOfWeekEnum)) {
      const pricing = await FieldPricing.find({
        fieldId,
        dayOfWeek: day,
        deletedAt: null,
      }).lean();

      if (pricing.length > 0) pricings[day] = joinDurations(pricing);
    }
    return { defaultPrice, pricings };
  } catch (error) {
    console.error("Error in getFieldPricingsByFieldId:", {
      message: error.message,
      cause: error.cause,
      stack: error.stack,
    });
    throw error;
  }
};
