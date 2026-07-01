function getOrCreateSpreadsheet() {
  const props = PropertiesService.getScriptProperties();
  let spreadsheetId = props.getProperty('WEDDING_RSVP_SPREADSHEET_ID');
  let ss;

  if (spreadsheetId) {
    try {
      ss = SpreadsheetApp.openById(spreadsheetId);
    } catch (error) {
      ss = SpreadsheetApp.create('Wedding RSVP Responses');
      props.setProperty('WEDDING_RSVP_SPREADSHEET_ID', ss.getId());
    }
  } else {
    ss = SpreadsheetApp.create('Wedding RSVP Responses');
    props.setProperty('WEDDING_RSVP_SPREADSHEET_ID', ss.getId());
  }

  return ss;
}

function getOrCreateSheet(ss) {
  const sheetName = 'RSVP Responses';
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Attendance', 'Message']);
  }

  return sheet;
}

function doGet(e) {
  return HtmlService.createHtmlOutput('<p>Wedding RSVP endpoint is live.</p>');
}

function doPost(e) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = getOrCreateSheet(ss);
    const row = [
      new Date().toISOString(),
      e.parameter.name || '',
      e.parameter.email || '',
      e.parameter.attendance || '',
      e.parameter.message || ''
    ];

    sheet.appendRow(row);
    return ContentService.createTextOutput('OK');
  } catch (error) {
    return ContentService.createTextOutput('Error: ' + error.message)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}
