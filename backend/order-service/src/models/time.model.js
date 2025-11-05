import mongoose from "mongoose";

export const timeSchema = new mongoose.Schema({
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
