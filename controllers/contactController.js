const pool = require("../config/db");

const {
  addContact
} = require("../services/googleSheets");

exports.sendContact = async (req, res) => {

  try {

    const {

      nom,

      entreprise,

      email,

      telephone,

      sujet,

      message

    } = req.body;

    // Validation

    if (!nom || !email || !message) {

      return res.status(400).json({

        success: false,

        message:
          "Nom, email et message sont obligatoires"

      });

    }

    // Enregistrement PostgreSQL

    const result = await pool.query(

      `
      INSERT INTO contacts

      (

        nom,

        entreprise,

        email,

        telephone,

        sujet,

        message

      )

      VALUES

      (

        $1,

        $2,

        $3,

        $4,

        $5,

        $6

      )

      RETURNING *

      `,

      [

        nom,

        entreprise,

        email,

        telephone,

        sujet,

        message

      ]

    );

    // Enregistrement Google Sheets

    await addContact({

      nom,

      entreprise,

      email,

      telephone,

      sujet,

      message

    });

    res.status(201).json({

      success: true,

      message:
        "Contact enregistré avec succès",

      data: result.rows[0]

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};


exports.getContacts = async (req, res) => {

  try {

    const result = await pool.query(

      `
      SELECT *

      FROM contacts

      ORDER BY created_at DESC

      `
    );

    res.status(200).json({

      success: true,

      count: result.rows.length,

      data: result.rows

    });

  }

  catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      error: error.message

    });

  }

};