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
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await pool.query(createQuery);
    console.log("Table 'users' créée");
  }
}

async function ensureTableExistsForWork() {
  const tableMissions = "missions";
  const [rows] = await pool.query("SHOW TABLES LIKE ?", [tableMissions]);
  if (rows.length === 0) {
    const createQuery = `
    CREATE TABLE missions (
      missions_id BIGINT PRIMARY KEY,
      employeId VARCHAR(255) NOT NULL,
      clientId VARCHAR(255) NOT NULL,
      adresseId VARCHAR(255) NOT NULL
    )
    `

    await pool.query(createQuery);
    console.log("Table 'missions' créée");
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
        objects VARCHAR(255) NOT NULL
      )
    `;
    await pool.query(createQuery);
    console.log(`Table ${table} créée`);
  }
}

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const [rows] = await pool.execute(
      'SELECT email, username FROM users WHERE email = ? OR username = ? LIMIT 1',
      [email, username]
    );

    if (rows.length > 0) {
      if (rows[0].email === email) {
        console.log("Email déjà utilisé");
      }
      if (rows[0].username === username) {
        console.log("Identifiant déjà utilisé");
      }
      return;
    }

    console.log("Email et identifiant disponibles");

    // Il vérif si la table est crée ou pas 
    await ensureTableExists();

    const hash = await bcrypt.hash(password, 10);

    // Schéma pour push la data
    const insertQuery = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

    // Il push la data depuis le schéma
    await pool.query(insertQuery, [username, email, hash]);

    res.status(201).json({ message: "Utilisateur créé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const {emailLogin, passwordLogin} = req.body;

  if (!emailLogin || !passwordLogin) {
    return res.status(400).json({message : "Tous les champs sont requis"})
  };

  const [rows] = await pool.execute(
    'SELECT * FROM users WHERE email = ? LIMIT 1',
    [emailLogin]
  )

  if (rows.length === 0) {
    return res.status(401).json({message : "Identifiants invalides"});
  }

  const user = rows[0]

  const isMatch = await bcrypt.compare(passwordLogin, user.password);
  if (!isMatch) {
    return res.status(401).json({message : "Identifiants invalides"})
  }

  console.log("Connexion réussie sur le compte => ", emailLogin)
  res.json({message : "Connexion réussie sur le compte => ", emailLogin})
}

exports.creatework = async (req, res) => {
  const { missions_id, employe_id, client_id, adresse_id, objects } = req.body;

  try {
    await ensureTableExistsForWork();

    await pool.query(
      "INSERT INTO missions (missions_id, employeId, clientId, adresseId) VALUES (?, ?, ?, ?)",
      [missions_id, employe_id, client_id, adresse_id]
    );

    await ensureTableExistsForWorkObjects();

    const insertObjectQuery =
      "INSERT INTO missions_objects (missions_id, objects) VALUES (?, ?)";

    for (const obj of objects) {
      await pool.query(insertObjectQuery, [missions_id, obj]);
    }

    return res.status(201).json({ message: "Mission créée avec succès" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};


exports.getMissions = async (req, res) => {}