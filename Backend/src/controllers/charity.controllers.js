const { getDb, saveDb } = require("../services/dataStore");

function listCharities(req, res) {
  const db = getDb();
  const q = (req.query.q || "").toLowerCase();
  const category = (req.query.category || "").toLowerCase();

  const results = db.charities.filter((c) => {
    const matchQ = !q || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    const matchCategory = !category || c.category.toLowerCase() === category;
    return matchQ && matchCategory;
  });

  return res.json({ charities: results, featured: results.filter((c) => c.featured) });
}

function selectCharity(req, res) {
  const { charityId, charityPercent, independentDonation = 0 } = req.body;
  const db = getDb();
  const charity = db.charities.find((c) => c.id === charityId);
  if (!charity) {
    return res.status(404).json({ message: "Charity not found" });
  }

  if (Number(charityPercent) < 10) {
    return res.status(400).json({ message: "Charity contribution must be at least 10%" });
  }

  req.user.charityId = charityId;
  req.user.charityPercent = Number(charityPercent);
  req.user.independentDonation = Number(independentDonation) || 0;

  if (req.user.independentDonation > 0) {
    db.donations.push({
      id: `don_${Date.now()}`,
      userId: req.user.id,
      charityId,
      amount: req.user.independentDonation,
      createdAt: new Date().toISOString(),
      type: "independent"
    });
  }

  saveDb();
  return res.json({ message: "Charity preferences updated" });
}

module.exports = {
  listCharities,
  selectCharity
};
