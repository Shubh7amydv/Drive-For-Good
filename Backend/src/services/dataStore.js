const fs = require("fs");
const path = require("path");
const { charities: seedCharities } = require("../config/seedContent");

const dataDir = path.join(__dirname, "../../data");
const dbPath = path.join(dataDir, "db.json");

const initialDb = {
  users: [],
  charities: [],
  draws: [],
  winners: [],
  donations: []
};

let dbCache = null;

function seedData() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dbPath)) {
    const seeded = {
      ...initialDb,
      charities: seedCharities,
      users: [
        {
          id: "admin_1",
          name: "Admin User",
          email: "admin@driveforgood.app",
          passwordHash: "$2a$10$BsTu/KrjnnG4OyeR9EtrGuPY.SbczBaHQLXfVFVMYmCMXmncMmYjC",
          role: "admin",
          charityId: null,
          charityPercent: 0,
          independentDonation: 0,
          scores: [],
          winningsTotal: 0,
          subscription: {
            plan: "yearly",
            status: "active",
            renewalDate: "2027-01-01"
          },
          createdAt: new Date().toISOString()
        },
        {
          id: "test_user_1",
          name: "Test Golfer",
          email: "test@driveforgood.app",
          passwordHash: "$2a$10$jGQf6A3g6Tzl7w5dVR8jvOvJ8M/J88kgT/nQjv8Aj0CA7I8AuMqda",
          role: "user",
          charityId: "charity_1",
          charityPercent: 15,
          independentDonation: 0,
          scores: [
            { id: "sc_1", value: 32, date: "2026-03-25" },
            { id: "sc_2", value: 28, date: "2026-03-20" },
            { id: "sc_3", value: 35, date: "2026-03-15" },
            { id: "sc_4", value: 29, date: "2026-03-10" },
            { id: "sc_5", value: 33, date: "2026-03-05" }
          ],
          winningsTotal: 0,
          subscription: {
            plan: "monthly",
            status: "active",
            renewalDate: "2027-05-03"
          },
          createdAt: new Date().toISOString()
        }
      ]
    };
    fs.writeFileSync(dbPath, JSON.stringify(seeded, null, 2));
  }

  dbCache = JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

function getDb() {
  if (!dbCache) {
    seedData();
  }

  // Self-heal charity list in case persisted data was created without seed content.
  if (!Array.isArray(dbCache.charities) || dbCache.charities.length === 0) {
    dbCache.charities = seedCharities;
    saveDb();
  }

  return dbCache;
}

function saveDb() {
  fs.writeFileSync(dbPath, JSON.stringify(dbCache, null, 2));
}

module.exports = {
  seedData,
  getDb,
  saveDb
};
