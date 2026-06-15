const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email et mot de passe requis"
        });
        }

    const result = await pool.query(
      "SELECT * FROM admins WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    const admin = result.rows[0];

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ou mot de passe incorrect"
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h"
      }
    );

    res.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};