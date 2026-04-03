const express = require("express");
const {
  subscribe,
  verifySubscription,
  cancelSubscription,
  addScore,
  updateScore,
  getDashboard
} = require("../controllers/user.controllers");
const {
  authenticate,
  requireActiveSubscription
} = require("../middlewares/auth.middlewares");
const { selectCharity } = require("../controllers/charity.controllers");
const { submitWinnerProof } = require("../controllers/admin.controllers");

const router = express.Router();

router.use(authenticate);

router.get("/dashboard", getDashboard);
router.post("/subscription", subscribe);
router.post("/subscription/verify", verifySubscription);
router.post("/subscription/cancel", cancelSubscription);
router.post("/charity", selectCharity);
router.post("/scores", requireActiveSubscription, addScore);
router.patch("/scores/:scoreId", requireActiveSubscription, updateScore);
router.post("/winner-proof/:winnerId", submitWinnerProof);

module.exports = router;
