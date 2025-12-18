import { getRevenueOfOwner } from "../services/revenue.service.js";

export const getRevenue = async (req, res) => {
  try {
    const ownerId = req.params.owner_id;
    const data = await getRevenueOfOwner(ownerId);
    res.status(200).send({ message: "Revenue retrieved successfully", data: data });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
