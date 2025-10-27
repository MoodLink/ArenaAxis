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

const timeSchema = new mongoose.Schema({
  hour: {
    type: Number,
    required: true,
    min: 0,
    max: 23
  },
  minute: {
    type: Number,
    required: true,
    min: 0,
    max: 59
  }
}, { _id: false });

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
