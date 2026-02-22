const pool = require('../config/db');

exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { reqComingIdToBack } = req.body;

        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [reqComingIdToBack]
        );

        const isAdmin = rows[0];

        if (!isAdmin) {
            return res.status(404).json({ error: "Admin introuvable" });
        }

        if (isAdmin.id === parseInt(userId)) {
            return res.status(400).json({ code: "01", message: "Impossible de se supprimer soi-même" });
        }

        if (isAdmin.id > parseInt(userId)) {
            return res.status(400).json({ code: "02", message: "Impossible de supprimer une personne plus haut que vous." });
        }

        if (isAdmin.isAdmin !== 1) {
            return res.status(403).json({ error: "Accès interdit" });
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

        // PARTIE SOCKET

        const io = req.app.get('io');
        io.to(`user_${userId}`).emit('accountDeleted');

        res.status(200).json({ message: "Utilisateur supprimé avec succès" });

    } catch (error) {
        console.error("Erreur deleteUser:", error);
        res.status(500).json({ error: "Erreur serveur" });
    }
};