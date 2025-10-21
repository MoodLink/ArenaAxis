import { Field } from "../models/field.model.js";

export const create = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("User Info:", req.user);
    const body = {
      sportId: req.body.sport_id,
      storeId: req.body.store_id,
      defaultPrice: req.body.default_price,
      createdAt: new Date(),
      activeStatus: req.body.active_status,
    };
    const field = new Field(body);
    const data = await field.save();

    res.status(201).send({ message: "Field created successfully", data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
