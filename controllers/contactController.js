const pool = require("../config/db");

const {
  addContact,
} = require("../services/googleSheets");

exports.sendContact = async (req, res) => {
  try {
    const {
      nom,
      entreprise,
      email,
      telephone,
      sujet,
      message,
    } = req.body;

    // Vérification des champs obligatoires
    if (
      typeof nom !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !nom.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Nom, email et message sont obligatoires",
      });
    }

    // Nettoyage
    const cleanNom = nom.trim();

    const cleanEmail = email
      .trim()
      .toLowerCase();

    const cleanMessage = message.trim();

    // Validation de l'email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Adresse email invalide",
      });
    }

    // Limites de longueur
    if (
      cleanNom.length > 100 ||
      cleanEmail.length > 254 ||
      cleanMessage.length > 2000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Certaines données sont trop longues",
      });
    }

    // Nettoyage des champs optionnels
    const cleanString = (
      value,
      maxLength
    ) => {
      if (
        value === undefined ||
        value === null ||
        value === ""
      ) {
        return null;
      }

      if (typeof value !== "string") {
        return null;
      }

      const cleaned = value.trim();

      if (cleaned.length > maxLength) {
        return null;
      }

      return cleaned;
    };

    const cleanEntreprise = cleanString(
      entreprise,
      150
    );

    const cleanTelephone = cleanString(
      telephone,
      30
    );

    const cleanSujet = cleanString(
      sujet,
      150
    );

    // Enregistrement PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO contacts (
        nom,
        entreprise,
        email,
        telephone,
        sujet,
        message
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      )
      RETURNING
        id,
        nom,
        email,
        sujet,
        created_at
      `,
      [
        cleanNom,
        cleanEntreprise,
        cleanEmail,
        cleanTelephone,
        cleanSujet,
        cleanMessage,
      ]
    );

    // Enregistrement Google Sheets
    await addContact({
      nom: cleanNom,
      entreprise: cleanEntreprise,
      email: cleanEmail,
      telephone: cleanTelephone,
      sujet: cleanSujet,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message:
        "Contact enregistré avec succès",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Erreur création contact :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Une erreur interne est survenue.",
    });
  }
};


exports.getContacts = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        nom,
        entreprise,
        email,
        telephone,
        sujet,
        message,
        created_at
      FROM contacts
      ORDER BY created_at DESC
      `
    );

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });

  } catch (error) {
    console.error(
      "Erreur récupération contacts :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Une erreur interne est survenue.",
    });
  }
};
