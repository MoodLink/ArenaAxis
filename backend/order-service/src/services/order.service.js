import { PayOS } from "@payos/node";
import dotenv from "dotenv";
dotenv.config();

const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

export const createOrderService = async (paymentData) => {
  try {
    const { amount, description, items } = paymentData;

    if (
      !amount ||
      !description ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      throw new Error("Missing required fields: amount, description, or items");
    }

    const requestData = {
      orderCode: Number(String(Date.now()).slice(-6)),
      amount,
      description,
      items,
      returnUrl: `http://localhost:3000/api/v1/orders/success`,
      cancelUrl: `http://localhost:3000/api/v1/orders/cancel`,
    };

    console.log("Request Data:", requestData);

    const paymentResponse = await payOS.paymentRequests.create(requestData);
    console.log("Payment Response:", paymentResponse);
    return (data = {
      orderCode: paymentResponse.orderCode,
      amount: paymentResponse.amount,
      checkoutUrl: paymentResponse.checkoutUrl,
      description: paymentResponse.description,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};
