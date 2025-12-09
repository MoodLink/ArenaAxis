const express = require("express");
const { PayOS } = require('@payos/node');
const axios = require("axios"); 

require("dotenv").config();

const app = express();
// Keep your PayOS key protected by including it by an env variable

const payOS = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", express.static("public"));
console.log("Payout methods:", Object.keys(payOS.payouts));
app.post("/create-payment-link", async (req, res) => {
  const YOUR_DOMAIN = `http://localhost:3030`;
  const body = {
    orderCode: Number(String(Date.now()).slice(-6)),
    amount: 3000,
    description: "Thanh toan don hang",
    items: [
      {
        name: "Mì tôm Hảo Hảo ly",
        quantity: 1,
        price: 1000,
      },
    ],
    returnUrl: `${YOUR_DOMAIN}/success.html`,
    cancelUrl: `${YOUR_DOMAIN}/cancel.html`,
  };

  try {
    const paymentLinkResponse = await payOS.paymentRequests.create(body);

    res.redirect(paymentLinkResponse.checkoutUrl);
  } catch (error) {
    console.error(error);
    res.send("Something went error");
  }
});

// Endpoint để tạo yêu cầu chuyển tiền (Payout)
app.post("/create-payout", async (req, res) => {
  try {
    const requestData = {
      amount: 1000,
      toAccountNumber: "00000377737",
      toBin: "01358001",
      description: "Chuyen tien PayOS",
      referenceId: `PO-${Math.floor(Math.random() * 1000000)}`,
    };

    // Kiểm tra dữ liệu đầu vào
    if (!requestData.toAccountNumber || !requestData.toBin) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: accountNumber, bankCode, or accountName",
      });
    }

    try {
      const paymentLinkResponse = await payOS.payouts.create(requestData);

      console.log("Payout created successfully:", paymentLinkResponse.approvalState);
    } catch (error) {
      console.error(error);
      res.send("Something went error");
    }
  } catch (error) {
    console.error("Error creating payout:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/cancel.html", (req, res) => {
  res.send("Thanh toán đã bị hủy.");
});
app.get("/success.html", (req, res) => {
  res.send("Thanh toán thành công!");
});

app.listen(3030, function () {
  console.log(`Server is listening on port 3030`);
});
