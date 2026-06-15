const pool = require("../config/db");

const {
  addDevis
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

      message

    } = req.body;


    // Validation

    if (!nom || !email || !service) {

      return res.status(400).json({

        success: false,

        message:
          "Nom, email et service sont obligatoires"

      });

    }


    // Enregistrement PostgreSQL

    const result = await pool.query(

      `

      INSERT INTO devis

      (

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

      VALUES

      (

        $1,

        $2,

        $3,

        $4,

        $5,

        $6,

        $7,

        $8,

        $9

      )

      RETURNING *

      `,

      [

        nom,

        entreprise,

        email,

        telephone,

        secteurActivite,

        typeVehicule,

        nombreVehicules,

        service,

        message

      ]

    );


    // Enregistrement Google Sheets

    await addDevis({

      nom,

      entreprise,

      email,

      telephone,

      secteurActivite,

      typeVehicule,

      nombreVehicules,

      service,

      message

    });


    res.status(201).json({

      success: true,

      message:
        "Demande de devis enregistrée",

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



exports.getDevis = async (req, res) => {

  try {

    const result = await pool.query(

      `

      SELECT *

      FROM devis

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