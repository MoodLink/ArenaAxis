import { Field } from "../models/field.model.js";
import { handleUpdateSportForStore } from "./store.service.js";
import axios from "axios";
import dotenv from "dotenv";
import { getFieldPricingsByFieldId } from "./field-pricing.service.js";

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

export const getStoreDetails = async (storeId) => {
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
    const pricings = await getFieldPricingsByFieldId(field._id);
    field.pricings = pricings;
  }
  console.log("Fields with details:", data);
  return data;
};

export const getFieldById = async (fieldId) => {
  const data = await Field.find({ _id: fieldId }).lean();
  // for (let field of data) {
  //   const sport = await getSportDetails(field.sportId);
  //   field.sport_name = sport ? sport.name : "Unknown Sport";
  // }
  return data;
};

export const create = async (body, req) => {
  const field = new Field(body);
  const data = await field.save();
  // await handleUpdateSportForStore(req, data.storeId, data.sportId, true);
  return data;
};

export const update = async (fieldId, updateData) => {
  const existingField = await Field.findById(fieldId);
  if (!existingField) {
    return null;
  }
  const oldSportId = existingField.sportId;
  
  Object.assign(existingField, updateData);
  const data = await existingField.save();

  // if (oldSportId !== data.sportId) {
  //   await handleUpdateSportForStore(req, data.storeId, oldSportId, false);
  //   await handleUpdateSportForStore(req, data.storeId, data.sportId, true);
  // }

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
