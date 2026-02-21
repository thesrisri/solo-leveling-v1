const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { complete } = require("./daily.controller");

const router = express.Router();

router.post("/complete", authMiddleware, complete);

module.exports = router;