const pool = require('../config/db')

exports.pseudoChange = async (req, res) => {
    const {pseudoChange, IdForPseudo} = req.body;

    if (!pseudoChange || !IdForPseudo) {return res.status(400).json({message : "Tous les champs sont requis"})};

    await pool.execute('UPDATE users SET pseudo = ? WHERE id = ?',
        [pseudoChange, IdForPseudo]
    )

    // Crée les vérifs 

    console.log("Good")
}