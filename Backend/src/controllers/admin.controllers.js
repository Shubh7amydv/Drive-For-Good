const { getDb, saveDb } = require("../services/dataStore");
const { sendPayoutEmail } = require("../services/email.service");

function getAnalytics(_, res) {
  const db = getDb();
  const activeSubscribers = db.users.filter((u) => u.role === "user" && u.subscription.status === "active");
  const totalPrizePool = db.draws.reduce((sum, d) => sum + d.pools.total, 0);
  const totalCharityContribution = activeSubscribers.reduce((sum, user) => {
    const base = user.subscription.plan === "yearly" ? 190 : 19;
    return sum + base * (user.charityPercent / 100);
  }, 0);

  return res.json({
    totalUsers: db.users.filter((u) => u.role === "user").length,
    totalPrizePool: Number(totalPrizePool.toFixed(2)),
    totalCharityContribution: Number(totalCharityContribution.toFixed(2)),
    drawStats: db.draws.slice().reverse()
  });
}

function listUsers(_, res) {
  const db = getDb();
  const users = db.users
    .filter((u) => u.role === "user")
    .map(({ passwordHash, ...rest }) => rest);
  return res.json({ users });
}

function updateUser(req, res) {
  const db = getDb();
  const user = db.users.find((u) => u.id === req.params.userId && u.role === "user");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, subscriptionStatus, charityPercent } = req.body;

  if (name) {
    user.name = name;
  }
  if (subscriptionStatus) {
    user.subscription.status = subscriptionStatus;
  }
  if (charityPercent && charityPercent >= 10) {
    user.charityPercent = charityPercent;
  }

  saveDb();
  return res.json({ message: "User updated" });
}

function listWinners(_, res) {
  const db = getDb();
  const winners = db.winners.slice().reverse();
  return res.json({ winners });
}

function submitWinnerProof(req, res) {
  const db = getDb();
  const winner = db.winners.find((w) => w.id === req.params.winnerId);
  if (!winner) {
    return res.status(404).json({ message: "Winner record not found" });
  }

  winner.proofUrl = req.body.proofUrl || null;
  winner.verificationStatus = "submitted";
  saveDb();
  return res.json({ message: "Proof submitted" });
}

function reviewWinner(req, res) {
  const db = getDb();
  const winner = db.winners.find((w) => w.id === req.params.winnerId);
  if (!winner) {
    return res.status(404).json({ message: "Winner not found" });
  }

  const { action } = req.body;
  if (!["approve", "reject", "paid"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  if (action === "approve") {
    winner.verificationStatus = "approved";
  }
  if (action === "reject") {
    winner.verificationStatus = "rejected";
  }
  if (action === "paid") {
    winner.paymentStatus = "paid";
    
    // Send payout notification email asynchronously
    setImmediate(async () => {
      const user = db.users.find((u) => u.id === winner.userId);
      if (user) {
        await sendPayoutEmail(user, winner);
      }
    });
  }

  saveDb();
  return res.json({ message: "Winner status updated", winner });
}

function upsertCharity(req, res) {
  const db = getDb();
  const { id, name, category, description, featured = false, events = [], imageUrl = "" } = req.body;

  if (!name || !category || !description) {
    return res.status(400).json({ message: "name, category and description are required" });
  }

  if (id) {
    const existing = db.charities.find((c) => c.id === id);
    if (!existing) {
      return res.status(404).json({ message: "Charity not found" });
    }

    Object.assign(existing, { name, category, description, featured, events, imageUrl });
    saveDb();
    return res.json({ message: "Charity updated", charity: existing });
  }

  const charity = {
    id: `charity_${Date.now()}`,
    name,
    category,
    description,
    featured,
    events,
    imageUrl
  };

  db.charities.push(charity);
  saveDb();
  return res.status(201).json({ message: "Charity created", charity });
}

function deleteCharity(req, res) {
  const db = getDb();
  const idx = db.charities.findIndex((c) => c.id === req.params.charityId);
  if (idx === -1) {
    return res.status(404).json({ message: "Charity not found" });
  }

  db.charities.splice(idx, 1);
  saveDb();
  return res.json({ message: "Charity deleted" });
}

module.exports = {
  getAnalytics,
  listUsers,
  updateUser,
  listWinners,
  submitWinnerProof,
  reviewWinner,
  upsertCharity,
  deleteCharity
};
