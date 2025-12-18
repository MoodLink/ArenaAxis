import orderRoute from "./order.route.js";
import fieldRoute from "./field.route.js";
import fieldPricingRoute from "./field-pricing.route.js";
import revenueRoute from "./revenue.route.js";
import { infoUser } from "../middlewares/auth.middleware.js";

export default (app) => {
  const version = "/api/v1";

  app.use(infoUser);

  app.use(version + "/orders", orderRoute);
  app.use(version + "/fields", fieldRoute);
  app.use(version + "/field-pricings", fieldPricingRoute);
  app.use(version + "/revenue", revenueRoute);
};
