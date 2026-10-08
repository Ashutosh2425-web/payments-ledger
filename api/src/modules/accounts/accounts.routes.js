const express = require("express");
const { getMe } = require("./accounts.controller");
const authMiddleware = require("../auth/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, getMe);

module.exports = router;