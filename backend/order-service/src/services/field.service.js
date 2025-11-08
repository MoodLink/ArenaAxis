import { Field } from "../models/field.model.js";
import { handleUpdateSportForStore } from "./store.service.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_URL;

async function getSportDetails(sportId) {
  try {
    const response = await axios.get(
      `${USER_SERVICE_BASE_URL}/sports/${sportId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch sport details:", error.message);
    return null;
  }
}

async function getStoreDetails(storeId) {
  try {
    const response = await axios.get(
      `${USER_SERVICE_BASE_URL}/stores/detail/${storeId}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch store details:", error.message);
    return null;
  }
}

export const getFields = async (filter) => {
  const data = await Field.find(filter).sort({ updatedAt: -1 }).lean();
  for (let field of data) {
    const sport = await getSportDetails(field.sportId);
    field.sport_name = sport ? sport.name : "Unknown Sport";
    const store = await getStoreDetails(field.storeId);
    field.address = store ? store.address : "Field Address";
    field.avatar = store
      ? store.avatarUrl
      : "https://i.pinimg.com/1200x/d4/29/1e/d4291ea760fcbf77ef282cb83ab7127b.jpg";
    field.cover_image = store
      ? store.coverImageUrl
      : "https://i.pinimg.com/736x/53/d1/a5/53d1a5c4d0b705c714e0cec6ebe582e3.jpg";
  }
  console.log("Fields with details:", data);
  return data;
};

export const getFieldById = async (fieldId) => {
  const data = await Field.find({ _id: fieldId }).lean();
  for (let field of data) {
    const sport = await getSportDetails(field.sportId);
    field.sport_name = sport ? sport.name : "Unknown Sport";
    const store = await getStoreDetails(field.storeId);
    field.address = store ? store.address : "Field Address";
    field.avatar = store
      ? store.avatarUrl
      : "https://i.pinimg.com/1200x/d4/29/1e/d4291ea760fcbf77ef282cb83ab7127b.jpg";
    field.cover_image = store
      ? store.coverImageUrl
      : "https://i.pinimg.com/736x/53/d1/a5/53d1a5c4d0b705c714e0cec6ebe582e3.jpg";
  }
  return data;
};

export const create = async (body, req) => {
  const field = new Field(body);
  const data = await field.save();
  await handleUpdateSportForStore(req, data.storeId, data.sportId, true);
  return data;
};

export const update = async (fieldId, updateData) => {
  const existingField = await Field.findById(fieldId);
  const oldSportId = existingField.sportId;

  Object.assign(existingField, updateData);
  const data = await existingField.save();

  if (oldSportId !== data.sportId) {
    await handleUpdateSportForStore(req, data.storeId, oldSportId, false);
    await handleUpdateSportForStore(req, data.storeId, data.sportId, true);
  }

  return data;
};

export const remove = async (fieldId) => {
  const data = await Field.findByIdAndUpdate(
    fieldId,
    {
      activeStatus: false,
      updatedAt: new Date(),
    },
    { new: true }
  );
  await handleUpdateSportForStore(req, data.storeId, data.sportId, false);
  return data;
};
