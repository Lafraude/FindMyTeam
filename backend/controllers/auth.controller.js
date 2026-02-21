const pool = require("../config/db");
const bcrypt = require("bcrypt");

async function ensureTableExistsForWork() {
  const tableMissions = "missions";
  const [rows] = await pool.query("SHOW TABLES LIKE ?", [tableMissions]);
  
  if (rows.length === 0) {
    const createQuery = `
      CREATE TABLE missions (
        missions_id BIGINT PRIMARY KEY,
        employeId VARCHAR(255) NOT NULL,
        clientId VARCHAR(255) NOT NULL,
        adresseId VARCHAR(255) NOT NULL,
        status ENUM('attente', 'cours', 'fini') DEFAULT 'attente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createQuery);
    console.log("- Table 'missions' créée");
  }
}

async function ensureTableExistsForWorkObjects() {
  const table = "missions_objects";
  const [rows] = await pool.query("SHOW TABLES LIKE ?", [table]);

  if (rows.length === 0) {
    const createQuery = `
      CREATE TABLE missions_objects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        missions_id BIGINT NOT NULL,
        objects VARCHAR(255) NOT NULL,
        FOREIGN KEY (missions_id) REFERENCES missions(missions_id) ON DELETE CASCADE
      )
    `;
    await pool.query(createQuery);
    console.log(`- Table ${table} créée`);
  }
}

exports.creatework = async (req, res) => {
  const { missions_id, employe_id, client_id, adresse_id, objects } = req.body;

  try {
    if (!missions_id || !employe_id || !client_id || !adresse_id || !Array.isArray(objects)) {
      return res.status(400).json({ 
        message: "Tous les champs sont requis (missions_id, employe_id, client_id, adresse_id, objects)" 
      });
    }

    await ensureTableExistsForWork();
    await ensureTableExistsForWorkObjects();

    await pool.query(
      "INSERT INTO missions (missions_id, employeId, clientId, adresseId, status) VALUES (?, ?, ?, ?, 'attente')",
      [missions_id, employe_id, client_id, adresse_id]
    );

    const insertObjectQuery = "INSERT INTO missions_objects (missions_id, objects) VALUES (?, ?)";
    for (const obj of objects) {
      await pool.query(insertObjectQuery, [missions_id, obj]);
    }

    console.log(`- Mission ${missions_id} créée pour l'employé ${employe_id}`);
    
    return res.status(201).json({ 
      message: "Mission créée avec succès",
      mission: { missions_id, employe_id, client_id, adresse_id, objects, status: 'attente' }
    });

  } catch (err) {
    console.error("❌ Erreur creatework:", err);
    
    // Gestion des erreurs de clés dupliquées
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Cette mission existe déjà" });
    }
    
    return res.status(500).json({ message: err.message });
  }
};

exports.getMissions = async (req, res) => {
  try {
    const employeId = req.headers["x-username"];
    
    if (!employeId) {
      return res.status(400).json({ error: "Employé non identifié dans les headers" });
    }

    const query = `
      SELECT 
        m.missions_id AS id,
        m.employeId   AS employe_id,
        m.clientId    AS client_id,
        m.adresseId   AS adresse_id,
        m.status,
        GROUP_CONCAT(mo.objects) AS objects
      FROM missions m
      LEFT JOIN missions_objects mo
        ON mo.missions_id = m.missions_id
      WHERE m.employeId = ?
      GROUP BY 
        m.missions_id,
        m.employeId,
        m.clientId,
        m.adresseId,
        m.status
      ORDER BY 
        FIELD(m.status, 'attente', 'cours', 'fini'),
        m.created_at DESC
    `;

    const [rows] = await pool.execute(query, [employeId]);

    const missions = (rows || []).map(m => ({
      id: m.id,
      employe_id: m.employe_id,
      client_id: m.client_id,
      adresse_id: m.adresse_id,
      status: m.status || "attente",
      objects: m.objects ? m.objects.split(',') : []
    }));

    console.log(`- ${missions.length} mission(s) récupérée(s) pour l'employé sous id : ${employeId}`);

    res.status(200).json({ missions });

  } catch (err) {
    console.error("- Erreur getMissions:", err);
    res.status(500).json({ error: "Erreur lors de la récupération des missions" });
  }
};

exports.putMissions = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status || !["attente", "cours", "fini"].includes(status)) {
      return res.status(400).json({ error: "Statut invalide (attente, cours ou fini)" });
    }

    const [rows] = await pool.execute(
      "SELECT status FROM missions WHERE missions_id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Mission non trouvée" });
    }

    // Empêcher la modification d'une mission déjà terminée
    if (rows[0].status === "fini") {
      return res.status(400).json({ 
        error: "Impossible de modifier une mission déjà terminée" 
      });
    }

    // Mettre à jour le statut
    await pool.execute(
      "UPDATE missions SET status = ? WHERE missions_id = ?",
      [status, id]
    );

    console.log(`- Statut de la mission ${id} mis à jour : ${status}`);

    res.status(200).json({ 
      message: "Statut mis à jour avec succès",
      mission: { id, status }
    });

  } catch (err) {
    console.error("- Erreur putMissions:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour" });
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const userName = req.headers["x-username"];

    if (!userName) {
      return res.json({ isAdmin: false });
    }

    // Requête pour récupérer l'utilisateur
    const [rows] = await pool.execute(
      "SELECT isAdmin FROM users WHERE username = ? LIMIT 1",
      [userName]
    );

    // Si l'utilisateur n'existe pas
    if (rows.length === 0) {
      return res.json({ isAdmin: false });
    }

    // Retourner le statut admin (converti en boolean)
    const user = rows[0];
    const isAdmin = user.isAdmin === 1 || user.isAdmin === true;

    console.log(`- Vérification admin pour ${userName}: ${isAdmin}`);

    return res.json({ isAdmin });

  } catch (err) {
    console.error("❌ Erreur getAdmin:", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};