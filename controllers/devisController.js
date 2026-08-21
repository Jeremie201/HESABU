const pool = require("../config/db");

const {
  addDevis,
} = require("../services/googleSheets");

exports.createDevis = async (req, res) => {
  try {
    const {
      nom,
      entreprise,
      email,
      telephone,
      secteurActivite,
      typeVehicule,
      nombreVehicules,
      service,
      message,
    } = req.body;

    // Vérification des champs obligatoires
    if (
      typeof nom !== "string" ||
      typeof email !== "string" ||
      typeof service !== "string" ||
      !nom.trim() ||
      !email.trim() ||
      !service.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Nom, email et service sont obligatoires",
      });
    }

    // Nettoyage des données
    const cleanNom = nom.trim();
    const cleanEmail = email
      .trim()
      .toLowerCase();
    const cleanService = service.trim();

    // Validation simple de l'email
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
      cleanService.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Certaines données sont trop longues",
      });
    }

    // Validation du nombre de véhicules
    let cleanNombreVehicules = null;

    if (
      nombreVehicules !== undefined &&
      nombreVehicules !== null &&
      nombreVehicules !== ""
    ) {
      cleanNombreVehicules =
        Number(nombreVehicules);

      if (
        !Number.isInteger(
          cleanNombreVehicules
        ) ||
        cleanNombreVehicules < 1 ||
        cleanNombreVehicules > 100000
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Nombre de véhicules invalide",
        });
      }
    }

    // Fonction pour nettoyer les champs optionnels
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

      return cleaned.length > maxLength
        ? null
        : cleaned;
    };

    const cleanEntreprise = cleanString(
      entreprise,
      150
    );

    const cleanTelephone = cleanString(
      telephone,
      30
    );

    const cleanSecteurActivite =
      cleanString(
        secteurActivite,
        100
      );

    const cleanTypeVehicule =
      cleanString(
        typeVehicule,
        100
      );

    const cleanMessage = cleanString(
      message,
      2000
    );

    // Enregistrement PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO devis (
        nom,
        entreprise,
        email,
        telephone,
        secteur_activite,
        type_vehicule,
        nombre_vehicules,
        service,
        message
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9
      )
      RETURNING
        id,
        nom,
        email,
        service,
        created_at
      `,
      [
        cleanNom,
        cleanEntreprise,
        cleanEmail,
        cleanTelephone,
        cleanSecteurActivite,
        cleanTypeVehicule,
        cleanNombreVehicules,
        cleanService,
        cleanMessage,
      ]
    );

    // Enregistrement Google Sheets
    await addDevis({
      nom: cleanNom,
      entreprise: cleanEntreprise,
      email: cleanEmail,
      telephone: cleanTelephone,
      secteurActivite:
        cleanSecteurActivite,
      typeVehicule:
        cleanTypeVehicule,
      nombreVehicules:
        cleanNombreVehicules,
      service: cleanService,
      message: cleanMessage,
    });

    return res.status(201).json({
      success: true,
      message:
        "Demande de devis enregistrée",
      data: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Erreur création devis :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Une erreur interne est survenue.",
    });
  }
};


exports.getDevis = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        id,
        nom,
        entreprise,
        email,
        telephone,
        secteur_activite,
        type_vehicule,
        nombre_vehicules,
        service,
        message,
        created_at
      FROM devis
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
      "Erreur récupération devis :",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Une erreur interne est survenue.",
    });
  }
};
