const pool = require('../config/db')

exports.changeUserName = async (req, res) => {
    const {newUserName, idUserName} = req.body;

    if (!newUserName || !idUserName) {return res.status(400).json({message : "Tous les champs sont requis"})};

    try {
        await pool.execute('UPDATE users SET username = ? WHERE id = ?',
            [newUserName, idUserName]
        )
        return res.status(200).json({message : "Username mis à jour avec succès"});
    } catch (error) {
        return res.status(500).json({message : "Erreur serveur"});
    }
}