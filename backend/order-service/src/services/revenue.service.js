import axios from "axios";
import dotenv from "dotenv";
import { Order } from "../models/order.model.js";

dotenv.config();

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_URL;

export const getRevenueOfOwner = async (ownerId) => {
  try {
    let data = {};

    const response = await axios.get(
      `${USER_SERVICE_BASE_URL}/stores/owner/${ownerId}`
    );
    const stores = response.data;

    let totalRevenue = 0;
    let storeCount = 0;
    let totalRevenueInCurrentDay = 0;
    let totalTransactions = 0;
    for (const store of stores) {
      const orders = await Order.find({ storeId: store.id, statusPayment: "PAID" }).select('cost createdAt updatedAt').lean();

      for (const order of orders) {
        totalRevenue += order.cost;
        totalTransactions += 1;
        const orderDate = new Date(order.updatedAt);
        const currentDate = new Date();
        if (
          orderDate.getDate() === currentDate.getDate() &&
          orderDate.getMonth() === currentDate.getMonth() &&
          orderDate.getFullYear() === currentDate.getFullYear()
        ) {
          totalRevenueInCurrentDay += order.cost;
        }
      }
      storeCount += 1;
    }

    data.storeCount = storeCount;
    data.totalRevenue = totalRevenue;
    data.totalRevenueInCurrentDay = totalRevenueInCurrentDay;
    data.totalTransactions = totalTransactions;

    return data;
  } catch (error) {
    console.error("Error fetching revenue for owner:", error);
    throw error;
  }
};
