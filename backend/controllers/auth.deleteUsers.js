const pool = require('../config/db');

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ error: "ID utilisateur manquant" });
        }

        const [check] = await pool.execute(
            "SELECT id FROM users WHERE id = ?",
            [userId]
        );

        if (check.length === 0) {
            return res.status(404).json({ error: "Utilisateur introuvable" });
        }

        await pool.execute(
            "DELETE FROM users WHERE id = ?",
            [userId]
        );

        res.status(200).json({ message: "Utilisateur supprimé avec succès" });

    } catch (error) {
        console.error("Erreur deleteUser:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};
