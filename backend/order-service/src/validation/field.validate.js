export const validateField = (req, res, next) => {
  const { name, sport_id, store_id, default_price } = req.body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).send({ message: "Invalid or missing 'name' field" });
  }

  if (!sport_id || typeof sport_id !== "string" || sport_id.trim() === "") {
    return res
      .status(400)
      .send({ message: "Invalid or missing 'sport_id' field" });
  }

  if (!store_id || typeof store_id !== "string" || store_id.trim() === "") {
    return res
      .status(400)
      .send({ message: "Invalid or missing 'store_id' field" });
  }

  console.log("Validating default_price:", default_price);

  if (!default_price) {
    return res.status(400).send({ message: "Missing 'default_price' field" });
  }

  const priceNumber = Number(default_price);
  if (isNaN(priceNumber) || priceNumber < 0) {
    return res
      .status(400)
      .send({ message: "'default_price' must be a non-negative number" });
  }

  console.log("Field data is valid.");
  next();
};

export const validateUpdateField = (req, res, next) => {
  const { name, sport_id, store_id, default_price, active_status } = req.body;
  
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).send({ message: "Invalid 'name' field" });
  }

  if (!sport_id || typeof sport_id !== "string" || sport_id.trim() === "") {
    return res.status(400).send({ message: "Invalid 'sport_id' field" });
  }

  if (store_id !== undefined) {
    if (!store_id || typeof store_id !== "string" || store_id.trim() === "") {
      return res.status(400).send({ message: "Invalid 'store_id' field" });
    }
  }

  if (!default_price) {
    return res.status(400).send({ message: "Missing 'default_price' field" });
  }

  const priceNumber = Number(default_price);
  if (isNaN(priceNumber) || priceNumber < 0) {
    return res
      .status(400)
      .send({ message: "'default_price' must be a non-negative number" });
  }

  if (active_status !== undefined) {
    if (
      !active_status ||
      (active_status !== "true" && active_status !== "false")
    ) {
      return res
        .status(400)
        .send({ message: "'active_status' must be boolean" });
    }
  }
  next();
};
