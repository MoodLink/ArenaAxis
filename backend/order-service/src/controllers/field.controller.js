import { create as createField } from "../services/field.service.js";
import { getFields as getFieldsService } from "../services/field.service.js";
import { getFieldById as getFieldByIdService } from "../services/field.service.js";
import { update as updateField } from "../services/field.service.js";
import { remove as removeField } from "../services/field.service.js";
import { fieldSearch } from "../utils/search.js";

// [GET] /fields?sport_id=&store_id=&active_status=&keyword
export const getFields = async (req, res) => {
  try {
    const sportId = req.query.sport_id;
    const storeId = req.query.store_id;
    const activeStatus = req.query.active_status;
    const filter = {};
    if (sportId) filter.sportId = sportId;
    if (storeId) filter.storeId = storeId;
    if (activeStatus !== undefined)
      filter.activeStatus = activeStatus === "true";
    const objectSearch = fieldSearch(req.query);
    if (req.query.keyword) {
      filter.defaultPrice = objectSearch.regex;
    }

    const data = await getFieldsService(filter);
    res.status(200).send({ message: "Fields retrieved successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [GET] /fields/:field_id
export const getFieldDetail = async (req, res) => {
  try {
    const fieldId = req.params.field_id;
    const data = await getFieldByIdService({ _id: fieldId });
    if (data.length === 0) {
      return res.status(404).send({ message: "Field not found" });
    }
    res
      .status(200)
      .send({ message: "Field detail retrieved successfully", data: data[0] });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [POST] /fields
export const create = async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      sportId: req.body.sport_id,
      storeId: req.body.store_id,
      defaultPrice: req.body.default_price,
      createdAt: new Date(),
    };

    const data = await createField(body);

    res.status(201).send({ message: "Field created successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [PATCH] /fields/:field_id
export const update = async (req, res) => {
  try {
    const fieldId = req.params.field_id;
    let updateData = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.sport_id !== undefined) updateData.sportId = req.body.sport_id;
    if (req.body.store_id !== undefined) updateData.storeId = req.body.store_id;
    if (req.body.default_price !== undefined)
      updateData.defaultPrice = req.body.default_price;
    if (req.body.active_status !== undefined)
      updateData.activeStatus = req.body.active_status;
    updateData.updatedAt = new Date();
    const data = await updateField(fieldId, updateData);

    if (!data) {
      return res.status(404).send({ message: "Field not found" });
    }

    res.status(200).send({ message: "Field updated successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [DELETE] /fields/:field_id
export const remove = async (req, res) => {
  try {
    const fieldId = req.params.field_id;
    const data = await removeField(fieldId);
    if (!data) {
      return res.status(404).send({ message: "Field not found" });
    }
    res.status(200).send({ message: "Field deleted successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// [GET] /fields/store
export const getStore = async (req, res) => {
  try {
    const sportId = req.query.sport_id;
    const filter = {};
    if (sportId) filter.sportId = sportId;

    const data = await getFieldsService(filter);
    const storeIds = [...new Set(data.map((field) => field.storeId))];

    res
      .status(200)
      .send({ message: "Store IDs retrieved successfully", data: storeIds });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
