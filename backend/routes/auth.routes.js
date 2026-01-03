const express = require("express");
const router = express.Router();
const controller = require("../controllers/auth.controller");
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Accès refusé" });
    }
    next();
}

router.post("/register", authMiddleware, controller.register);
router.post("/login", authMiddleware, controller.login);
router.post("/creatework", authMiddleware, controller.creatework);

module.exports = router;