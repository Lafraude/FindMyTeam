const express = require('express');
const rateLimit = require("express-rate-limit");
const cors = require('cors');
const fs = require('fs').promises;
const fsSync = require("fs");
require('dotenv').config();

const app = express();
const PORT = 3000;
const PATH_ADD_MISSIONS = "./data/missions.json";
const PATH_ADD_USER = "./data/users.json"

// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 600
});

// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

const authMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Accès refusé" });
    }
    next();
}

// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "DELETE", "PUT"],
}));
app.use(limiter);
app.use(express.json());

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes)

// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

;(async () => {
    try {
        await fs.mkdir("./data", { recursive: true });
        try {
            await fs.access(PATH_ADD_MISSIONS);
            console.log(" - Le fichier =>", PATH_ADD_MISSIONS, "existe déjà.");
        } catch {
            await fs.writeFile(PATH_ADD_MISSIONS, "[]", "utf8");
            console.log("Fichier missions.json créé !");
        }
    } catch (err) {
        console.error("Erreur initialisation fichier :", err);
    }
})();

;(async () => {
    try {
        await fs.mkdir("./data", { recursive: true });
        try {
            await fs.access(PATH_ADD_USER);
            console.log(" - Le fichier =>", PATH_ADD_USER, "existe déjà.");
        } catch {
            await fs.writeFile(PATH_ADD_USER, "[]", "utf8");
            console.log("Fichier missions.json créé !");
        }
    } catch (err) {
        console.error("Erreur initialisation fichier :", err);
    }
})();

// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

// app.get('/', authMiddleware, (req, res) => {
//     res.json({ message: 'Serveur actif', status: 'OK' });
// });

app.post("/missionsAdd", authMiddleware, async (req, res) => {
    const { employe_id, client_id, adresse_id, objects } = req.body;

    if (!employe_id || !client_id || !adresse_id || !Array.isArray(objects)) {
        return res.status(400).json({ error: "Données invalides" });
    }

    const missionsData = {
        id: Date.now(),
        employe_id,
        client_id,
        adresse_id,
        objects
    };

    try {
        // Lis le fichier pour push la nouvelle data en +
        const fileData = await fs.readFile(PATH_ADD_MISSIONS, "utf8");
        const missions = JSON.parse(fileData || "[]");
        // Push la nouvelle data
        missions.push(missionsData);
        // Réécris avec la nouvelle data
        await fs.writeFile(PATH_ADD_MISSIONS, JSON.stringify(missions, null, 2), "utf8");
        res.json({ message: "Mission ajoutée", mission: missionsData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.get("/viewmissions", authMiddleware, async (req, res) => {
    try {
        const userName = req.headers["x-username"]; // Récupère l'utilisateur depuis le header
        
        if (!userName) {
            return res.status(400).json({ error: "Utilisateur non identifié" });
        }

        const fileData = await fs.readFile(PATH_ADD_MISSIONS, "utf8");
        const missions = JSON.parse(fileData || "[]");
        
        const userMissions = missions.filter(mission => mission.employe_id === userName); // <= Système de filtre
        
        res.json({ missions: userMissions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.put("/missions/:id", authMiddleware, async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!status || !["attente", "cours", "fini"].includes(status)) {
        return res.status(400).json({ error: "Status invalide" });
    }

    try {
        const fileData = await fs.readFile(PATH_ADD_MISSIONS, "utf8");
        const missions = JSON.parse(fileData || "[]");

        const missionIndex = missions.findIndex(m => m.id === id);
        if (missionIndex === -1) return res.status(404).json({ error: "Mission non trouvée" });

        if (missions[missionIndex].status === "fini") {
            return res.status(400).json({ error: "Impossible de modifier une mission déjà terminée" });
        }

        missions[missionIndex].status = status;
        await fs.writeFile(PATH_ADD_MISSIONS, JSON.stringify(missions, null, 2), "utf8");

        res.json({ message: "Status mis à jour", mission: missions[missionIndex] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

app.delete("/missions/delete/:id", authMiddleware, async (req, res) => {
    
})



// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

app.post("/adduser", async (req, res) => {
    const { addUserValue, addAdminValue } = req.body;

    // Faire la sécu, pour éviter que le route sois utilisé pour save ce que qu'il veulent
    // - - Donc ajouter une vérif

    // if (!addUserValue || !addAdminValue || !dataAddUser) {
    //     return res.status(400).json({ error: "Données invalide" });
    // }

    const newUser = {
        id: Date.now(),
        userName: addUserValue,
        isAdmin : addAdminValue,
    };

    try {
        if (!fsSync.existsSync(PATH_ADD_USER)) {
            await fs.writeFile(PATH_ADD_USER, "[]", "utf8");
        }

        const fileData = await fs.readFile(PATH_ADD_USER, "utf8");
        const users = fileData.trim() ? JSON.parse(fileData) : [];

        users.push(newUser);

        await fs.writeFile(
            PATH_ADD_USER,
            JSON.stringify(users, null, 2),
            "utf8"
        );

        return res.json({ id: newUser.id });

    } catch (err) {
        console.error("ERREUR :", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});


app.post("/deleteuser/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;


    try {
        const fileData = await fs.readFile(PATH_ADD_USER, "utf8");
        const users = fileData.trim() ? JSON.parse(fileData) : [];

        const initialLength = users.length;

        const filteredUsers = users.filter(user => user.id !== Number(id));

        if (filteredUsers.length === initialLength) {
            return res.status(404).json({ error: "User non trouvé" });
        }

        await fs.writeFile(
            PATH_ADD_USER,
            JSON.stringify(filteredUsers, null, 2),
            "utf8"
        );

        return res.json({ success: true, deletedId: Number(id) });

    } catch (err) {
        console.error("ERREUR deleteuser :", err);
        return res.status(500).json({ error: "Erreur serveur" });
    }
});


app.get("/viewuser", authMiddleware, async (req, res) => {

    try {
        const fileData = await fs.readFile(PATH_ADD_USER, "utf8");
        const users = fileData.trim() ? JSON.parse(fileData) : [];

        return res.json({
            success: true,
            count: users.length,
            users
        });

    } catch (err) {
        console.error("ERREUR viewuser :", err);
        return res.status(500).json({ error: "erreur serveur" });
    }
});

app.get("/getadmin", authMiddleware, async (req, res) => {
    try {
        const userName = req.headers["x-username"];

        if (!userName) {
            return res.json({ isAdmin: false });
        }

        const fileData = await fs.readFile(PATH_ADD_USER, "utf8");
        const users = fileData.trim() ? JSON.parse(fileData) : [];

        const user = users.find(u => u.userName === userName);

        return res.json({
            isAdmin: user?.isAdmin === "true"
        });

    } catch (err) {
        console.error("ERREUR getadmin :", err);
        return res.status(500).json({ error: "erreur serveur" });
    }
});


// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //
// -------------------- //// -------------------- //// -------------------- //

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
