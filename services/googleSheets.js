const { google } = require("googleapis");

// Vérification des variables nécessaires
const requiredEnv = [
  "GOOGLE_PROJECT_ID",
  "GOOGLE_CLIENT_EMAIL",
  "GOOGLE_PRIVATE_KEY",
];

for (const variable of requiredEnv) {
  if (!process.env[variable]) {
    throw new Error(
      `Variable d'environnement manquante : ${variable}`
    );
  }
}

// Authentification Google
const auth = new google.auth.GoogleAuth({
  credentials: {
    project_id: process.env.GOOGLE_PROJECT_ID,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(
      /\\n/g,
      "\n"
    ),
  },

  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

const sheets = google.sheets({
  version: "v4",
  auth,
});

const SPREADSHEET_ID =
  "1Skz257Qu02uR979PLuaSA0-lRG3MJXSuvWI6ujSzFIQ";

// Protection contre l'injection de formules Google Sheets
const safeSheetValue = (value) => {
  if (
    value === undefined ||
    value === null
  ) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.startsWith("=") ||
    stringValue.startsWith("+") ||
    stringValue.startsWith("-") ||
    stringValue.startsWith("@")
  ) {
    return `'${stringValue}`;
  }

  return stringValue;
};

// Ajouter un contact
const addContact = async ({
  nom,
  entreprise,
  email,
  telephone,
  sujet,
  message,
}) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,

    range: "Contacts!A:G",

    valueInputOption: "USER_ENTERED",

    requestBody: {
      values: [
        [
          new Date().toLocaleString(),

          safeSheetValue(nom),

          safeSheetValue(entreprise),

          safeSheetValue(email),

          safeSheetValue(telephone),

          safeSheetValue(sujet),

          safeSheetValue(message),
        ],
      ],
    },
  });
};

// Ajouter un devis
const addDevis = async ({
  nom,
  entreprise,
  email,
  telephone,
  secteurActivite,
  typeVehicule,
  nombreVehicules,
  service,
  message,
}) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,

    range: "Devis!A:J",

    valueInputOption: "USER_ENTERED",

    requestBody: {
      values: [
        [
          new Date().toLocaleString(),

          safeSheetValue(nom),

          safeSheetValue(entreprise),

          safeSheetValue(email),

          safeSheetValue(telephone),

          safeSheetValue(
            secteurActivite
          ),

          safeSheetValue(typeVehicule),

          safeSheetValue(
            nombreVehicules
          ),

          safeSheetValue(service),

          safeSheetValue(message),
        ],
      ],
    },
  });
};

module.exports = {
  addContact,
  addDevis,
};
