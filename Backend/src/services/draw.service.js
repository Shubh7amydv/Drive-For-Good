const { getDb } = require("./dataStore");

function randomNumber() {
  return Math.floor(Math.random() * 45) + 1;
}

function generateRandomDrawSet() {
  const values = new Set();
  while (values.size < 5) {
    values.add(randomNumber());
  }
  return Array.from(values).sort((a, b) => a - b);
}

function generateWeightedDrawSet() {
  const db = getDb();
  const frequencyMap = new Map();

  db.users.forEach((user) => {
    (user.scores || []).forEach((score) => {
      frequencyMap.set(score.value, (frequencyMap.get(score.value) || 0) + 1);
    });
  });

  const weighted = [...frequencyMap.entries()].sort((a, b) => b[1] - a[1]);
  const picks = weighted.slice(0, 5).map(([value]) => value);

  while (picks.length < 5) {
    const candidate = randomNumber();
    if (!picks.includes(candidate)) {
      picks.push(candidate);
    }
  }

  return picks.sort((a, b) => a - b);
}

function countMatches(userScores, drawSet) {
  const latest = userScores.slice(0, 5).map((s) => s.value);
  return latest.filter((n) => drawSet.includes(n)).length;
}

function createPrizePool(activeSubscribers, subscriptionAmount, previousJackpot = 0) {
  const gross = activeSubscribers * subscriptionAmount;
  return {
    total: gross,
    fiveMatch: gross * 0.4 + previousJackpot,
    fourMatch: gross * 0.35,
    threeMatch: gross * 0.25
  };
}

module.exports = {
  generateRandomDrawSet,
  generateWeightedDrawSet,
  countMatches,
  createPrizePool
};
