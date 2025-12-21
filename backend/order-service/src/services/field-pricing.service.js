import { daysOfWeekEnum } from "../models/field-pricing.model.js";
import moment from "moment-timezone";

export const createFieldPricing = ({ FieldPricing, generateDurations }) => {
  return async (body) => {
    try {
      const { startAt, endAt } = body;
      body.durations = generateDurations(startAt, endAt);
      body.dayOfWeeks = body.dayOfWeeks.map((day) => day.toLowerCase());
      const results = [];
      for (const dayOfWeek of body.dayOfWeeks) {
        for (const duration of body.durations) {
          await FieldPricing.findOneAndUpdate(
            {
              fieldId: body.fieldId,
              dayOfWeek,
              startAt: duration.startAt,
              endAt: duration.endAt,
              deletedAt: null,
            },
            { deletedAt: new Date() },
            { new: true }
          );

          const newPricing = await FieldPricing.create({
            fieldId: body.fieldId,
            specialPrice: body.specialPrice,
            dayOfWeek,
            startAt: duration.startAt,
            endAt: duration.endAt,
          });
          results.push(newPricing);
        }
      }
    } catch (error) {
      console.error("Error in createFieldPricing:", {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
      throw error;
    }
  };
};

export const createFieldPricingSpecial = ({
  FieldPricingSpecial,
  generateDurationsDateTime,
}) => {
  return async (body) => {
    try {
      const { startAt, endAt } = body;
      body.durations = generateDurationsDateTime(startAt, endAt);
      for (const duration of body.durations) {
        // convert duration.startAt and duration.endAt to Date
        // const startDate = moment(duration.startAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm");
        // const endDate = moment(duration.endAt).tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm");
        await FieldPricingSpecial.findOneAndUpdate(
          {
            fieldId: body.fieldId,
            startAt: duration.startAt,
            endAt: duration.endAt,
            deletedAt: null,
          },
          { deletedAt: new Date() },
          { new: true }
        );

        const newPricingSpecial = await FieldPricingSpecial.create({
          fieldId: body.fieldId,
          specialPrice: body.specialPrice,
          startAt: duration.startAt,
          endAt: duration.endAt,
        });
      }
    } catch (error) {
      console.error("Error in createFieldPricingSpecial:", {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
      throw error;
    }
  };
};

export const getFieldPricingsByFieldId = ({ FieldPricing, joinDurations }) => {
  return async (fieldId) => {
    try {
      // get price from monday to sunday, if not found, use default price
      const pricings = {};
      for (const day of Object.values(daysOfWeekEnum)) {
        const pricing = await FieldPricing.find({
          fieldId,
          dayOfWeek: day,
          deletedAt: null,
        }).lean();

        if (pricing.length > 0) pricings[day] = joinDurations(pricing);
      }
      return pricings;
    } catch (error) {
      console.error("Error in getFieldPricingsByFieldId:", {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
      throw error;
    }
  };
};

export const getFieldSpecialPricingsByFieldId = ({
  FieldPricingSpecial,
  joinDurationsDateTime,
}) => {
  return async (fieldId) => {
    try {
      const specialPricings = await FieldPricingSpecial.find({
        fieldId,
        deletedAt: null,
      }).lean();

      if (specialPricings.length > 0) {
        // using moment to convert specialPricings.startAt and specialPricings.endAt to YYYY-MM-DD HH:mm format
        const duration = joinDurationsDateTime(specialPricings);
        for (const item of duration) {
          item.startAt = moment(item.startAt).format("YYYY-MM-DD HH:mm");
          item.endAt = moment(item.endAt).format("YYYY-MM-DD HH:mm");
        }
        return duration;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in getFieldSpecialPricingsByFieldId:", {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
      throw error;
    }
  };
};

export const getFieldPricingsByFieldIdAndDateTime = ({
  FieldPricing,
  FieldPricingSpecial,
  joinDurations,
}) => {
  return async (fieldId, dateTime) => {
    try {
      // dateTime is in format yyyy-mm-dd
      const date = new Date(dateTime);
      const dayOfWeek = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();
      const pricing = await FieldPricing.find({
        fieldId,
        dayOfWeek,
        deletedAt: null,
      }).lean();

      // for pricing items, find in FieldPricingSpecial where fieldId matches and dateTime == startAt == endAt (yyyy-mm-dd), if found, replace specialPrice, else add item to pricing
      const specialPricings = await FieldPricingSpecial.find({
        fieldId,
        startAt: {
          $gte: new Date(dateTime + "T00:00:00.000Z"),
          $lte: new Date(dateTime + "T23:59:59.999Z"),
        },
        deletedAt: null,
      }).lean();

      console.log("specialPricings:", date, specialPricings);

      for (const special of specialPricings) {
        // find matching pricing item
        const match = pricing.find(
          (item) =>
            item.startAt.hour === special.startAt.getHours() &&
            item.startAt.minute === special.startAt.getMinutes() &&
            item.endAt.hour === special.endAt.getHours() &&
            item.endAt.minute === special.endAt.getMinutes()
        );
        if (match) {
          match.specialPrice = special.specialPrice;
        } else {
          // add new item to pricing
          pricing.push({
            fieldId,
            specialPrice: special.specialPrice,
            dayOfWeek,
            startAt: {
              hour: special.startAt.getHours(),
              minute: special.startAt.getMinutes(),
            },
            endAt: {
              hour: special.endAt.getHours(),
              minute: special.endAt.getMinutes(),
            },
          });
        }
      }

      if (pricing.length > 0) {
        return joinDurations(pricing);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in getFieldPricingsByFieldId:", {
        message: error.message,
        cause: error.cause,
        stack: error.stack,
      });
      throw error;
    }
  };
};
