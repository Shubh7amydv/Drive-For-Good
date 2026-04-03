const express = require("express");
const { listCharities } = require("../controllers/charity.controllers");

const router = express.Router();

router.get("/", listCharities);

module.exports = router;
