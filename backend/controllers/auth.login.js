const pool = require('../config/db')
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
  const {userLogin, passwordLogin} = req.body;

  try {
    if (!userLogin || !passwordLogin) {
      return res.status(400).json({message : "Tous les champs sont requis"})
    }

    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? LIMIT 1',
      [userLogin]
    )

    if (rows.length === 0) {
      return res.status(401).json({message : "Identifiants invalides"});
    }

    const user = rows[0]
    
    const isMatch = await bcrypt.compare(passwordLogin, user.password);
    if (!isMatch) {
      return res.status(401).json({message : "Identifiants invalides"})
    }

    console.log("Connexion réussie sur le compte => ", userLogin)
    res.status(200).json({
      message : "Connexion réussie",
      userLogin: userLogin,
      idUser : user.id,
      pseudo: user.pseudo
    })
  } catch (err) {
    console.error("Erreur de connexion", err)
    res.status(500).json({error : "Erreur de connexion"})
  }
}