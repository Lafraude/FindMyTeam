const pool = require('../config/db')

exports.pseudoChange = async (req, res) => {
    const {pseudoChange, IdForPseudo} = req.body;

    if (!pseudoChange || !IdForPseudo) {return res.status(400).json({message : "Tous les champs sont requis"})};

    
    try {
        await pool.execute('UPDATE users SET pseudo = ? WHERE id = ?',
            [pseudoChange, IdForPseudo]
        );
        return res.status(200).json({message : "Pseudo mis à jour avec succès"});
    } catch (error) {
        console.error(error)
        return res.status(500).json({message : "Erreur Serveur"});
    }
}