import { mongoose } from "mongoose";

// enum from monday to sunday
const daysOfWeekEnum = {
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
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
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
