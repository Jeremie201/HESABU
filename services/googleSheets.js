const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile:
    "./config/hesabu-crm-e04d7a8e208e.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets"
  ]
});

const sheets = google.sheets({
  version: "v4",
  auth
});

const SPREADSHEET_ID =
  "1Skz257Qu02uR979PLuaSA0-lRG3MJXSuvWI6ujSzFIQ";

module.exports = {
  sheets,
  SPREADSHEET_ID
};

const addContact = async ({
  nom,
  entreprise,
  email,
  telephone,
  sujet,
  message
}) => {

  await sheets.spreadsheets.values.append({

    spreadsheetId: SPREADSHEET_ID,

    range: "Contacts!A:G",

    valueInputOption: "USER_ENTERED",

    requestBody: {

      values: [[

        new Date().toLocaleString(),

        nom,

        entreprise || "",

        email,

        telephone || "",

        sujet || "",

        message || ""

      ]]

    }

  });

};


const addDevis = async ({

  nom,

  entreprise,

  email,

  telephone,

  secteurActivite,

  typeVehicule,

  nombreVehicules,

  service,

  message

}) => {

  await sheets.spreadsheets.values.append({

    spreadsheetId: SPREADSHEET_ID,

    range: "Devis!A:J",

    valueInputOption: "USER_ENTERED",

    requestBody: {

      values: [[

        new Date().toLocaleString(),

        nom,

        entreprise || "",

        email,

        telephone || "",

        secteurActivite || "",

        typeVehicule || "",

        nombreVehicules || "",

        service || "",

        message || ""

      ]]

    }

  });

};


module.exports = {

  sheets,

  SPREADSHEET_ID,

  addContact,

  addDevis

};