const {
  sheets,
  SPREADSHEET_ID
} = require("../services/googleSheets");

exports.testGoogleSheet = async (
  req,
  res
) => {
  try {

    const response =
      await sheets.spreadsheets.values.get({
        spreadsheetId:
          SPREADSHEET_ID,
        range: "Contacts!A1:G10"
      });

    res.json({
      success: true,
      values: response.data.values || []
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};