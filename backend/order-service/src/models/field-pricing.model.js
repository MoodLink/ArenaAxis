import { mongoose } from "mongoose";
import { timeSchema } from "./time.model.js";

// enum from monday to sunday
export const daysOfWeekEnum = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
  SUNDAY: "sunday",
};

const fieldPricingSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    specialPrice: { type: Number, required: true },
    startAt: { type: timeSchema, required: true },
    endAt: { type: timeSchema, required: true },
    dayOfWeek: {
      type: String,
      enum: Object.values(daysOfWeekEnum),
      required: true,
    },
  },
  { timestamps: true }
);

export const FieldPricing = mongoose.model(
  "FieldPricing",
  fieldPricingSchema,
  "field-pricings"
);
