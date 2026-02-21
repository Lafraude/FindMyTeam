const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const register_router = require("../controllers/auth.register");
const login_router = require("../controllers/auth.login");
const viewuser = require("../controllers/auth.viewuser")
const deleteUser = require("../controllers/auth.deleteUsers");
const pseudo = require('../controllers/auth.pseudo');
const userNameChange = require('../controllers/auth.username');
const passwordModif = require('../controllers/auth.mdp');

require('dotenv').config();

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Accès refusé - API Key invalide" });
    }
    
    next();
};

router.post("/register", authMiddleware, register_router.register);

router.post("/login", authMiddleware, login_router.login);

router.post("/creatework", authMiddleware, controller.creatework);

router.get("/getmissions", authMiddleware, controller.getMissions);

router.put("/missions/:id", authMiddleware, controller.putMissions);

router.get("/getadmin", authMiddleware, controller.getAdmin);

router.post('/viewuser', authMiddleware, viewuser.viewuser);

router.delete('/deleteuser/:userId', authMiddleware, deleteUser.deleteUser);

router.post('/pseudo/change', authMiddleware, pseudo.pseudoChange);

router.post('/user/change-name', authMiddleware, userNameChange.changeUserName);

router.post('/mdp/modif', authMiddleware, passwordModif.passwordModif)

module.exports = router;