import { mongoose } from 'mongoose';

const fieldPricingSpecialSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    specialPrice: { type: Number, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true }    
  },
  { timestamps: true }
);

export const FieldPricingSpecial = mongoose.model(
  'FieldPricingSpecial',
  fieldPricingSpecialSchema,
  'field-pricing-specials'
);
