import { Field } from "../models/field.model.js";

export const getFields = async (filter) => {
  const data = await Field.find(filter).sort({ updatedAt: -1 });
  return data;
};

export const getFieldById = async (fieldId) => {
  const data = await Field.find({ _id: fieldId });
  return data;
};

export const create = async (body) => {
  const field = new Field(body);
  const data = await field.save();
  return data;
};

export const update = async (fieldId, updateData) => {
  const data = await Field.findByIdAndUpdate(fieldId, updateData, {
    new: true,
  });
  return data;
};

export const remove = async (fieldId) => {
  const data = await Field.findByIdAndUpdate(fieldId, {
    activeStatus: false,
    updatedAt: new Date(),
  }, { new: true });
  return data;
};
