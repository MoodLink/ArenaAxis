import axios from "axios";
import dotenv from "dotenv";
import { Order } from "../models/order.model.js";
import { Field } from "../models/field.model.js";
import { OrderDetail } from "../models/order-detail.model.js";

dotenv.config();

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_URL;

export const getRevenueOfOwner = async (req, ownerId) => {
  try {
    let data = {};

    const response = await axios.get(
      `${USER_SERVICE_BASE_URL}/stores/owner/${ownerId}`,
      {
        headers: {
          'Authorization': `Bearer ${req.token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const stores = response.data;

    let totalRevenue = 0;
    let storeCount = 0;
    let totalRevenueInCurrentDay = 0;
    let totalTransactions = 0;
    let storeCards = [];
    for (const store of stores) {
      let storeItem = { id: store.id, name: store.name, address: store.address, linkGoogleMap: store.linkGoogleMap };
      const orders = await Order.find({ storeId: store.id, statusPayment: "PAID" }).select('cost createdAt updatedAt').lean();

      let storeRevenue = 0;
      let storeTransactions = 0;

      for (const order of orders) {
        storeRevenue += order.cost;
        totalRevenue += order.cost;
        totalTransactions += 1;
        storeTransactions += 1;
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
      storeCards.push({ ...storeItem, revenue: storeRevenue, transactions: storeTransactions });
    }

    data.storeCount = storeCount;
    data.totalRevenue = totalRevenue;
    data.totalRevenueInCurrentDay = totalRevenueInCurrentDay;
    data.totalTransactions = totalTransactions;
    data.storeCards = storeCards;

    return data;
  } catch (error) {
    console.error("Error fetching revenue for owner:", error);
    throw error;
  }
};

export const getRevenueOfStoreService = async (storeId) => {
  try {
    let data = {};
    let totalRevenue = 0;
    let totalOrder = 0;

    let fieldCards = [];

    const fields = await Field.find({ storeId: storeId }).lean();

    for (const field of fields) {
      let fieldItem = { id: field._id, name: field.name, defaultPrice: field.defaultPrice };
      const fieldOrderDetails = await OrderDetail.find({ fieldId: field._id }).lean();

      let orders = new Set();
      let fieldRevenue = 0;

      for (const orderDetail of fieldOrderDetails) {
        totalRevenue += orderDetail.price;
        fieldRevenue += orderDetail.price;
        orders.add(orderDetail.orderId);
      }

      totalOrder += orders.size;
      fieldCards.push({ ...fieldItem, revenue: fieldRevenue, transactions: orders.size });
    }

    data.fieldCount = fields.length;
    data.totalRevenue = totalRevenue;
    data.totalOrder = totalOrder;
    data.fieldCards = fieldCards;

    return data;
  } catch (error) {
    console.error("Error fetching revenue for store:", error);
    throw error;
  }
};
