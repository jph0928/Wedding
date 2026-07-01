function doGet(e) {
  return HtmlService.createHtmlOutput('<p>Wedding RSVP endpoint is live.</p>');
}

function doPost(e) {
  const sheetName = 'RSVP Responses';
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Attendance', 'Message']);
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const row = [];

  row.push(new Date().toISOString());
  row.push(e.parameter.name || '');
  row.push(e.parameter.email || '');
  row.push(e.parameter.attendance || '');
  row.push(e.parameter.message || '');

  sheet.appendRow(row);

  return ContentService.createTextOutput('OK');
}
