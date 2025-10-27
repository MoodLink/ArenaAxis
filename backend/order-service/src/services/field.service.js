import { Field } from "../models/field.model.js";
import { handleUpdateSportForStore } from "./store.service.js";

export const getFields = async (filter) => {
  const data = await Field.find(filter).sort({ updatedAt: -1 }).lean();
  for (let field of data) {
    field.sport_name = "Sport Name";
    field.address = "Field Address";
    field.avatar = "https://i.pinimg.com/1200x/d4/29/1e/d4291ea760fcbf77ef282cb83ab7127b.jpg";
    field.cover_image = "https://i.pinimg.com/736x/53/d1/a5/53d1a5c4d0b705c714e0cec6ebe582e3.jpg";
    field.rating = 4;
  }
  console.log("Fields with details:", data);
  return data;
};

export const getFieldById = async (fieldId) => {
  const data = await Field.find({ _id: fieldId }).lean();
    for (let field of data) {
    field.sport_name = "Sport Name";
    field.address = "Field Address";
    field.avatar = "https://i.pinimg.com/1200x/d4/29/1e/d4291ea760fcbf77ef282cb83ab7127b.jpg";
    field.cover_image = "https://i.pinimg.com/736x/53/d1/a5/53d1a5c4d0b705c714e0cec6ebe582e3.jpg";
    field.rating = 4;
  }
  return data;
};

export const create = async (body) => {
  const field = new Field(body);
  const data = await field.save();
  await handleUpdateSportForStore(data.storeId, data.sportId, true);
  return data;
};

export const update = async (fieldId, updateData) => {
  const existingField = await Field.findById(fieldId);
  const oldSportId = existingField.sportId;

  Object.assign(existingField, updateData);
  const data = await existingField.save();

  if (oldSportId !== data.sportId) {
    await handleUpdateSportForStore(data.storeId, oldSportId, false);
    await handleUpdateSportForStore(data.storeId, data.sportId, true);
  }

  return data;
};

export const remove = async (fieldId) => {
  const data = await Field.findByIdAndUpdate(fieldId, {
    activeStatus: false,
    updatedAt: new Date(),
  }, { new: true });
  await handleUpdateSportForStore(data.storeId, data.sportId, false);
  return data;
};
