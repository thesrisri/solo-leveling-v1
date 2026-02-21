const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { create, list } = require("./subtask.controller");

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/:taskId", authMiddleware, list);

module.exports = router;