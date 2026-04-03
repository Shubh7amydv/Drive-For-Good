const crypto = require("crypto");
const Razorpay = require("razorpay");
const {
  razorpayKeyId,
  razorpayKeySecret
} = require("../config/env");

function isRazorpayConfigured() {
  return Boolean(razorpayKeyId && razorpayKeySecret);
}

function isRazorpayTestMode() {
  return Boolean(razorpayKeyId && razorpayKeyId.startsWith("rzp_test_"));
}

function getRazorpayClient() {
  if (!isRazorpayConfigured()) {
    return null;
  }

  return new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret
  });
}

async function createOrder({ amountInInr, receipt, notes = {} }) {
  const client = getRazorpayClient();
  if (!client) {
    throw new Error("Razorpay is not configured");
  }

  return client.orders.create({
    amount: Math.round(Number(amountInInr) * 100),
    currency: "INR",
    receipt,
    notes
  });
}

function verifyPaymentSignature({ orderId, paymentId, signature }) {
  const payload = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac("sha256", razorpayKeySecret)
    .update(payload)
    .digest("hex");

  return expected === signature;
}

module.exports = {
  isRazorpayConfigured,
  isRazorpayTestMode,
  createOrder,
  verifyPaymentSignature
};
