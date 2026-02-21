const express = require("express");
const authMiddleware = require("../../middleware/auth.middleware");
const { register, login, logout,me } = require("./auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, me);
module.exports = router;