const pool = require('../config/db')

exports.viewuser = async (req, res) => {
    try {
        const [rows] = await pool.execute("SELECT * FROM users");
        res.status(200).json({ users: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
}