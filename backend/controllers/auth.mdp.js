const pool = require('../config/db')
const bcrypt = require("bcrypt");

exports.passwordModif = async (req, res) => {
    const {lastmdp, newmdp, idUser} = req.body;

    if (!lastmdp || !newmdp || !idUser) {return res.status(400).json({message : "Tous les champs sont requis"})};

    try {
        // const hash = await bcrypt.hash("test", 10);
        // console.log(hash)
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ? LIMIT 1',
            [idUser]
        )

        if (rows.length === 0) {
            return res.status(404).json({ message: "Utilisateur introuvable" })
        }

        if (newmdp.length < 8) {
            return res.status(400).json({ message: "Mot de passe trop court, minimum 8 caractères" })
        }

        const user = rows[0]


        const isMatch = await bcrypt.compare(lastmdp, user.password)
        if (!isMatch) {
            return res.status(403).json({ message : "Identifiants invalides" })
        } else {
            try {
                const hashedPassword = await bcrypt.hash(newmdp, 10)

                await pool.execute(
                    'UPDATE users SET password = ? WHERE id = ?',
                    [hashedPassword, idUser]
                )
                
                res.status(200).json({ message : "Mot de passe modifié avec succès"})

            } catch (error) {
                console.log(error)
                res.status(500).json({ message : "Erreur serveur"})
            }
        }
    } catch (error) {
        console.error("Error")
        res.status(500).json({ message : "ERREUR SERVEUR IMPORTANT"})
    }
}