import { Order } from "../models/order.model.js";
import { OrderDetail } from "../models/order-detail.model.js";
import { PayOS } from "@payos/node";
import { getFieldById, getFields } from "../services/field.service.js";
import { getUserInformation } from "../services/user.service.js";
import { createOrderService } from "../services/order.service.js";
import { payosWebhookHandler } from "../services/order.service.js";
import { getOrderService } from "../services/order.service.js";
import { getOrderByFieldIdAndDateTime } from "../services/order.service.js";
import { getOrdersByStoreService } from "../services/order.service.js";
import { getOrdersByUserService } from "../services/order.service.js";
import { mergeContinuous } from "../utils/time.util.js";
import { mergeOrderDetails } from "../utils/time.util.js";

import { Field } from "../models/field.model.js";
import { create, update, remove } from "../services/field.service.js";

import { FieldPricing } from "../models/field-pricing.model.js";
import { joinDurations } from "../utils/time.util.js";
import { generateDurations } from "../utils/time.util.js";
import { FieldPricingSpecial } from "../models/field-pricing-special.model.js";
import { getFieldPricingsByFieldIdAndDateTime } from "../services/field-pricing.service.js";
import { createFieldPricing } from "../services/field-pricing.service.js";
import { generateDurationsDateTime } from "../utils/time.util.js";
import { createFieldPricingSpecial } from "../services/field-pricing.service.js";
import { getFieldPricingsByFieldId } from "../services/field-pricing.service.js";
import { joinDurationsDateTime } from "../utils/time.util.js";
import { getFieldSpecialPricingsByFieldId } from "../services/field-pricing.service.js";

import { getRevenueOfOwner } from "../services/revenue.service.js";
import { getRevenueOfStoreService } from "../services/revenue.service.js";

import dotenv from "dotenv";
dotenv.config();

const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export const orderServices = {
  createOrder: createOrderService({
    Order,
    OrderDetail,
    payOS,
    mergeContinuous,
  }),
  payosWebhookHandler: payosWebhookHandler({
    Order,
  }),
  getOrder: getOrderService({
    Order,
    OrderDetail,
    getFieldById: getFieldById({
      Field,
    }),
    mergeOrderDetails,
  }),
  getOrderByFieldIdAndDateTime: getOrderByFieldIdAndDateTime({
    Order,
    OrderDetail,
    getUserInformation,
  }),
  getOrdersByStore: getOrdersByStoreService({
    Order,
    OrderDetail,
    mergeOrderDetails,
  }),
  getOrdersByUser: getOrdersByUserService({
    Order,
    OrderDetail,
    mergeOrderDetails,
  }),
};

export const fieldServices = {
  getFields: getFields({
    Field,
    getFieldPricingsByFieldIdAndDateTime: getFieldPricingsByFieldIdAndDateTime({
      FieldPricing,
      FieldPricingSpecial,
      joinDurations,
    }),
    getOrderByFieldIdAndDateTime: getOrderByFieldIdAndDateTime({
      Order,
      OrderDetail,
      getUserInformation,
    }),
  }),
  getFieldById: getFieldById({
    Field,
  }),
  create: create({ Field }),
  update: update({ Field }),
  remove: remove({ Field }),
};

export const fieldPricingServices = {
  createFieldPricing: createFieldPricing({
    FieldPricing,
    generateDurations,
  }),
  createFieldPricingSpecial: createFieldPricingSpecial({
    FieldPricingSpecial,
    generateDurationsDateTime,
  }),
  getFieldPricingsByFieldId: getFieldPricingsByFieldId({
    FieldPricing,
    joinDurations,
  }),
  getFieldSpecialPricingsByFieldId: getFieldSpecialPricingsByFieldId({
    FieldPricingSpecial,
    joinDurationsDateTime,
  }),
  getFieldPricingsByFieldIdAndDateTime: getFieldPricingsByFieldIdAndDateTime({
    FieldPricing,
    FieldPricingSpecial,
    joinDurations,
  }),
};

export const revenueServices = {
  getRevenueOfOwner: getRevenueOfOwner({ Order }),
  getRevenueOfStore: getRevenueOfStoreService({ Field, OrderDetail }),
};
