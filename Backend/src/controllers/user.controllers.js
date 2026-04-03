const { subscriptionSchema, scoreSchema } = require("../models/validators");
const { getDb, saveDb } = require("../services/dataStore");
const {
  subscriptionMonthly,
  subscriptionYearly,
  razorpayKeyId
} = require("../config/env");
const {
  isRazorpayConfigured,
  isRazorpayTestMode,
  createOrder,
  verifyPaymentSignature
} = require("../services/payment.service");
const { sendSubscriptionConfirmation } = require("../services/email.service");

function activatePendingSubscription(user, pending) {
  const renewal = new Date();
  renewal.setMonth(renewal.getMonth() + (pending.plan === "monthly" ? 1 : 12));

  user.subscription = {
    plan: pending.plan,
    status: "active",
    renewalDate: renewal.toISOString().slice(0, 10)
  };
  user.charityPercent = pending.charityPercent;
  user.pendingSubscription = null;
}

async function subscribe(req, res) {
  const parsed = subscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid subscription payload" });
  }

  const { plan, charityPercent } = parsed.data;
  const amount = plan === "monthly" ? subscriptionMonthly : subscriptionYearly;

  if (isRazorpayConfigured()) {
    try {
      const order = await createOrder({
        amountInInr: amount,
        receipt: `sub_${req.user.id}_${Date.now()}`,
        notes: {
          userId: req.user.id,
          plan
        }
      });

      req.user.pendingSubscription = {
        plan,
        charityPercent: charityPercent || req.user.charityPercent || 10,
        amount,
        orderId: order.id,
        createdAt: new Date().toISOString()
      };
      saveDb();

      return res.json({
        requiresPayment: true,
        keyId: razorpayKeyId,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency
        }
      });
    } catch {
      return res.status(500).json({ message: "Failed to create Razorpay order" });
    }
  }

  // Local fallback when gateway is not configured.
  activatePendingSubscription(req.user, {
    plan,
    charityPercent: charityPercent || req.user.charityPercent || 10
  });

  if (charityPercent) {
    req.user.charityPercent = charityPercent;
  }

  saveDb();

  // Send subscription confirmation email asynchronously
  setImmediate(async () => {
    await sendSubscriptionConfirmation(req.user, plan);
  });

  return res.json({
    message: "Subscription activated",
    subscription: req.user.subscription,
    payment: {
      amount,
      provider: "razorpay_stub"
    }
  });
}

function verifySubscription(req, res) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const pending = req.user.pendingSubscription;

  if (!pending) {
    if (isRazorpayTestMode() && req.user.subscription?.status === "active") {
      return res.json({
        message: "Test mode payment treated as successful",
        subscription: req.user.subscription,
        payment: {
          provider: "razorpay_test_auto_approved"
        }
      });
    }

    return res.status(400).json({ message: "No pending subscription payment found" });
  }

  if (isRazorpayTestMode() && (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature)) {
    activatePendingSubscription(req.user, pending);
    saveDb();

    setImmediate(async () => {
      await sendSubscriptionConfirmation(req.user, pending.plan);
    });

    return res.json({
      message: "Test mode payment treated as successful",
      subscription: req.user.subscription,
      payment: {
        provider: "razorpay_test_auto_approved"
      }
    });
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: "Payment verification payload is incomplete" });
  }

  if (pending.orderId !== razorpay_order_id) {
    return res.status(400).json({ message: "Order ID mismatch" });
  }

  const isValid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature
  });

  if (!isValid) {
    return res.status(400).json({ message: "Invalid Razorpay signature" });
  }

  activatePendingSubscription(req.user, pending);

  saveDb();

  // Send subscription confirmation email asynchronously
  setImmediate(async () => {
    await sendSubscriptionConfirmation(req.user, pending.plan);
  });

  return res.json({
    message: "Payment verified and subscription activated",
    subscription: req.user.subscription,
    payment: {
      provider: "razorpay",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id
    }
  });
}

function cancelSubscription(req, res) {
  req.user.subscription.status = "inactive";
  saveDb();
  return res.json({ message: "Subscription cancelled", subscription: req.user.subscription });
}

function addScore(req, res) {
  const parsed = scoreSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid score payload" });
  }

  req.user.scores.unshift({
    id: `score_${Date.now()}`,
    value: parsed.data.value,
    date: parsed.data.date
  });

  req.user.scores = req.user.scores
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  saveDb();
  return res.status(201).json({ scores: req.user.scores });
}

function updateScore(req, res) {
  const parsed = scoreSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid score payload" });
  }

  const score = req.user.scores.find((s) => s.id === req.params.scoreId);
  if (!score) {
    return res.status(404).json({ message: "Score not found" });
  }

  score.value = parsed.data.value;
  score.date = parsed.data.date;
  req.user.scores = req.user.scores.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  saveDb();
  return res.json({ scores: req.user.scores });
}

function getDashboard(req, res) {
  const db = getDb();

  if (isRazorpayTestMode() && req.user.pendingSubscription) {
    const pending = req.user.pendingSubscription;
    activatePendingSubscription(req.user, pending);
    saveDb();

    setImmediate(async () => {
      await sendSubscriptionConfirmation(req.user, pending.plan);
    });
  }

  const charity = db.charities.find((c) => c.id === req.user.charityId) || null;
  const userWins = db.winners.filter((w) => w.userId === req.user.id);
  const totalWon = userWins.reduce((sum, w) => sum + w.amount, 0);

  return res.json({
    subscription: req.user.subscription,
    scores: req.user.scores,
    charity: charity
      ? {
          id: charity.id,
          name: charity.name,
          percent: req.user.charityPercent
        }
      : null,
    participation: {
      drawsEntered: db.draws.length,
      upcomingDraws: 1
    },
    winnings: {
      totalWon,
      list: userWins
    }
  });
}

module.exports = {
  subscribe,
  verifySubscription,
  cancelSubscription,
  addScore,
  updateScore,
  getDashboard
};
