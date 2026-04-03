const { getDb, saveDb } = require("../services/dataStore");
const {
  generateRandomDrawSet,
  generateWeightedDrawSet,
  countMatches,
  createPrizePool
} = require("../services/draw.service");
const {
  sendDrawResultsEmail,
  sendWinnerNotificationEmail
} = require("../services/email.service");
const { subscriptionMonthly } = require("../config/env");

function runSimulation(req, res) {
  const mode = req.query.mode === "algorithm" ? "algorithm" : "random";
  const drawSet = mode === "algorithm" ? generateWeightedDrawSet() : generateRandomDrawSet();

  const db = getDb();
  const activeUsers = db.users.filter((u) => u.role === "user" && u.subscription.status === "active");

  const preview = activeUsers.map((user) => ({
    userId: user.id,
    email: user.email,
    matchCount: countMatches(user.scores || [], drawSet)
  }));

  return res.json({ mode, drawSet, preview });
}

function publishDraw(req, res) {
  const mode = req.body.mode === "algorithm" ? "algorithm" : "random";
  const drawSet = mode === "algorithm" ? generateWeightedDrawSet() : generateRandomDrawSet();

  const db = getDb();
  const activeUsers = db.users.filter((u) => u.role === "user" && u.subscription.status === "active");

  const previous = db.draws[db.draws.length - 1];
  const jackpotCarry = previous?.rollover || 0;
  const pools = createPrizePool(activeUsers.length, subscriptionMonthly, jackpotCarry);

  const winnersByTier = {
    5: [],
    4: [],
    3: []
  };

  activeUsers.forEach((user) => {
    const matchCount = countMatches(user.scores || [], drawSet);
    if (matchCount >= 3) {
      winnersByTier[matchCount].push({ userId: user.id, email: user.email, name: user.name });
    }
  });

  const drawId = `draw_${Date.now()}`;

  const splitPrize = (amount, winners) => (winners.length ? amount / winners.length : 0);

  const fivePrize = splitPrize(pools.fiveMatch, winnersByTier[5]);
  const fourPrize = splitPrize(pools.fourMatch, winnersByTier[4]);
  const threePrize = splitPrize(pools.threeMatch, winnersByTier[3]);

  const winnerEntries = [];

  winnersByTier[5].forEach((w) => {
    winnerEntries.push(buildWinner(drawId, w.userId, 5, fivePrize));
  });
  winnersByTier[4].forEach((w) => {
    winnerEntries.push(buildWinner(drawId, w.userId, 4, fourPrize));
  });
  winnersByTier[3].forEach((w) => {
    winnerEntries.push(buildWinner(drawId, w.userId, 3, threePrize));
  });

  db.winners.push(...winnerEntries);

  const rollover = winnersByTier[5].length === 0 ? pools.fiveMatch : 0;

  const drawRecord = {
    id: drawId,
    month: new Date().toISOString().slice(0, 7),
    mode,
    drawSet,
    pools,
    rollover,
    winners: {
      five: winnersByTier[5].length,
      four: winnersByTier[4].length,
      three: winnersByTier[3].length
    },
    publishedAt: new Date().toISOString()
  };

  db.draws.push(drawRecord);
  saveDb();

  // Send emails asynchronously (don't block response)
  setImmediate(async () => {
    // Send draw results to all active users
    for (const user of activeUsers) {
      const matchCount = countMatches(user.scores || [], drawSet);
      await sendDrawResultsEmail(user, {
        drawSet,
        userScores: user.scores || [],
        matchCount
      });
    }

    // Send winner notifications
    const allWinners = [...winnersByTier[5], ...winnersByTier[4], ...winnersByTier[3]];
    for (let i = 0; i < allWinners.length; i++) {
      const winner = allWinners[i];
      const winnerEntry = winnerEntries.find((w) => w.userId === winner.userId);
      if (winnerEntry) {
        await sendWinnerNotificationEmail(winner, {
          amount: winnerEntry.amount,
          matchType: winnerEntry.matchType
        });
      }
    }
  });

  return res.status(201).json({ draw: drawRecord, winnerEntries });
}

function listResults(req, res) {
  const db = getDb();
  return res.json({ draws: db.draws.slice().reverse() });
}

function buildWinner(drawId, userId, matchType, amount) {
  return {
    id: `win_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    drawId,
    userId,
    matchType,
    amount: Number(amount.toFixed(2)),
    proofUrl: null,
    verificationStatus: "pending",
    paymentStatus: "pending",
    createdAt: new Date().toISOString()
  };
}

module.exports = {
  runSimulation,
  publishDraw,
  listResults
};
