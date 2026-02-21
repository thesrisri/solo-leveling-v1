const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { create, list } = require("./task.controller");

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/:challengeId", authMiddleware, list);

module.exports = router;