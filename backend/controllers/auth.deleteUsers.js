const pool = require('../config/db');

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reqComingIdToBack } = req.body;

        const [rows] = await pool.execute(
            'SELECT * FROM users isAdmin WHERE id = ? ',
            [reqComingIdToBack]
        )

        const isAdmin = rows[0]

        if (isAdmin.id === parseInt(userId)) {
            return res.status(400).json({ code: "01", message: "Impossible de se supprimer soi-même" });
        }

        if (isAdmin.id > userId) {
            return res.status(400).json({ code: "02", message: "Impossible de supprimer une personne plus haut que vous."})
        }

        if (isAdmin.isAdmin !== 1) {
            return res.status(403).json({ error: "Accès interdit" });
        }

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
