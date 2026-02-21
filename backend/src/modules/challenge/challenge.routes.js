const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { create, list, extend } = require("./challenge.controller");

const router = express.Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, list);
router.patch("/extend", authMiddleware, extend);
module.exports = router;