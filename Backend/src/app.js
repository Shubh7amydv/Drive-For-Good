const express = require("express");
const cors = require("cors");
const { seedData } = require("./services/dataStore");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const drawRoutes = require("./routes/draw.routes");
const charityRoutes = require("./routes/charity.routes");

seedData();

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/draw", drawRoutes);
app.use("/api/charities", charityRoutes);

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
