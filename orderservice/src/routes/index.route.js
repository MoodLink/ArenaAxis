import orderRoute from "./order.route.js";

export default (app) => {
  const version = "/api/v1";

  app.use(version, orderRoute);
}
