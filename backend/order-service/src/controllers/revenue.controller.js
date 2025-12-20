import { getRevenueOfOwner } from "../services/revenue.service.js";
import { getRevenueOfStoreService } from "../services/revenue.service.js";

export const getRevenue = async (req, res) => {
  try {
    const ownerId = req.params.owner_id;
    const data = await getRevenueOfOwner(req, ownerId);
    res.status(200).send({ message: "Revenue retrieved successfully", data: data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export const getRevenueOfStore = async (req, res) => {
  try {
    const storeId = req.params.store_id;
    const data = await getRevenueOfStoreService(storeId);
    res.status(200).send({ message: "Store revenue retrieved successfully", data: data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
