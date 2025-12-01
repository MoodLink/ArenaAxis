export const validateFieldPricing = (req, res, next) => {
  const startAt = req.body.start_at;
  const endAt = req.body.end_at;

  // Kiểm tra có dữ liệu không
  if (!startAt || !endAt) {
    return res.status(400).json({ error: "startAt và endAt là bắt buộc" });
  }

  const timeRegex = /^([01]\d|2[0-3]):(00|30)$/;

  if (!timeRegex.test(startAt) || !timeRegex.test(endAt)) {
    return res.status(400).json({
      error: "Thời gian phải có định dạng HH:mm và phút chỉ được là 00 hoặc 30",
    });
  }

  const [sh, sm] = startAt.split(":").map(Number);
  const [eh, em] = endAt.split(":").map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  if (startMinutes >= endMinutes) {
    return res.status(400).json({ error: "startAt phải nhỏ hơn endAt" });
  }

  next();
};

export const validateFieldPricingSpecial = (req, res, next) => {
  // format: yyyy-mm-dd hh:mm, bắt buộc phải ví dụ hh:00 hoặc hh:30, start_at < end_at
  const startAt = req.body.start_at;
  const endAt = req.body.end_at;
  // Kiểm tra có dữ liệu không
  if (!startAt || !endAt) {
    return res.status(400).json({ error: "startAt và endAt là bắt buộc" });
  }
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} ([01]\d|2[0-3]):(00|30)$/;

  if (!dateTimeRegex.test(startAt) || !dateTimeRegex.test(endAt)) {
    return res.status(400).json({
      error:
        "Thời gian phải có định dạng yyyy-mm-dd HH:mm và phút chỉ được là 00 hoặc 30",
    });
  }

  const [startDate, startTime] = startAt.split(" ");
  const [endDate, endTime] = endAt.split(" ");

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;
  if (
    startDate > endDate ||
    (startDate === endDate && startMinutes >= endMinutes)
  ) {
    return res.status(400).json({ error: "startAt phải nhỏ hơn endAt" });
  }
  next();
};
