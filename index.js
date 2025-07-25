const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/shopify-order", async (req, res) => {
  try {
    const order = req.body;
    const name = order.customer?.first_name || "Customer";
    const phone = order.customer?.phone;

    if (!phone) {
      return res.status(400).send("No phone number found in order.");
    }

    const message = `Hi ${name}, thanks for your order #${order.name}! We'll notify you when it's shipped.`;

    const instanceId = "instance134942"; // ← replace
    const token = "mdst00wdm2memxbs";   // ← replace
    const url = `https://api.ultramsg.com/${instanceId}/messages/chat?token=${token}`;

    await axios.post(
      url,
      new URLSearchParams({
        to: phone,
        body: message
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    res.status(200).send("WhatsApp message sent!");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Failed to send message.");
  }
});

app.listen(3000, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});
