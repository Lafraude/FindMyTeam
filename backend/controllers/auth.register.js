const pool = require("../config/db");
const bcrypt = require("bcrypt");
const tableUsers = 'users'

async function ensureTableExists() {
  const [rows] = await pool.query("SHOW TABLES LIKE ?", [tableUsers]);
  if (rows.length === 0) {
    const createQuery = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        isAdmin VARCHAR(255) NOT NULL,
        idUser VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createQuery);
    console.log("Table 'users' créée");
  }
}

exports.register = async (req, res) => {
  try {
    const { username, password, isAdmin, pseudo } = req.body;

    if (!username || !password || !isAdmin || !pseudo) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Il vérif si la table est crée ou pas 
    await ensureTableExists();

    const hash = await bcrypt.hash(password, 10);

    // Schéma pour push la data
    const insertQuery = "INSERT INTO users (username, password, isAdmin, pseudo) VALUES (?, ?, ?, ?)";

    // Il push la data depuis le schéma
    await pool.query(insertQuery, [username, hash, isAdmin, pseudo]);

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};