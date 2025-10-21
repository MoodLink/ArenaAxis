import { mongoose } from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    sportId: { type: String },
    storeId: { type: String, required: true },
    defaultPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Field = mongoose.model("Field", fieldSchema, "fields");
