const express = require("express");
const { runSimulation, publishDraw, listResults } = require("../controllers/draw.controllers");
const { authenticate, requireAdmin } = require("../middlewares/auth.middlewares");

const router = express.Router();

router.get("/results", listResults);
router.get("/simulate", authenticate, requireAdmin, runSimulation);
router.post("/publish", authenticate, requireAdmin, publishDraw);

module.exports = router;
