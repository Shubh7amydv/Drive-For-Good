const express = require("express");
const {
  getAnalytics,
  listUsers,
  updateUser,
  listWinners,
  reviewWinner,
  upsertCharity,
  deleteCharity
} = require("../controllers/admin.controllers");
const {
  authenticate,
  requireAdmin
} = require("../middlewares/auth.middlewares");

const router = express.Router();

router.use(authenticate, requireAdmin);

router.get("/analytics", getAnalytics);
router.get("/users", listUsers);
router.patch("/users/:userId", updateUser);
router.get("/winners", listWinners);
router.patch("/winners/:winnerId", reviewWinner);
router.post("/charities", upsertCharity);
router.patch("/charities", upsertCharity);
router.delete("/charities/:charityId", deleteCharity);

module.exports = router;
