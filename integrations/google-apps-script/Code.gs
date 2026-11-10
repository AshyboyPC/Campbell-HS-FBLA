/**
 * Campbell FBLA Points Sync bridge.
 *
 * Script properties required:
 *   POINTS_SYNC_URL      e.g. https://campbellfbla.org
 *   POINTS_SYNC_SECRET   same value as GOOGLE_SYNC_WEBHOOK_SECRET on the server
 *
 * Install `attendanceFormSubmitted` on the all-activity Google Form and
 * `adviserActionEdited` on the adviser ledger spreadsheet. Never paste a
 * secret into a cell or this source file.
 */

function attendanceFormSubmitted(event) {
  var response = event.response;
  var answers = {};
  response.getItemResponses().forEach(function(itemResponse) {
    answers[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  });
  postSignedEvent_({
    purpose: "attendance_source",
    eventId: response.getId(),
    eventType: "form.response.created",
    payload: {
      submittedAt: response.getTimestamp().toISOString(),
      respondentEmail: response.getRespondentEmail() || null,
      answers: answers
    }
  });
}

function adviserActionEdited(event) {
  var sheet = event.range.getSheet();
  if (sheet.getName() !== "Adviser Actions" || event.range.getRow() === 1) return;
  var lastColumn = sheet.getLastColumn();
  var headers = sheet.getRange(1, 1, 1, lastColumn).getDisplayValues()[0];
  var values = sheet.getRange(event.range.getRow(), 1, 1, lastColumn).getDisplayValues()[0];
  var row = {};
  headers.forEach(function(header, index) { row[header] = values[index]; });
  postSignedEvent_({
    purpose: "adviser_ledger",
    eventId: event.source.getId() + ":" + sheet.getSheetId() + ":" + event.range.getRow() + ":" + new Date().getTime(),
    eventType: "sheet.adviser_action.edited",
    payload: { sheet: sheet.getName(), rowNumber: event.range.getRow(), row: row }
  });
}

function installPointsSync() {
  var spreadsheet = SpreadsheetApp.getActive();
  ["Members", "Point Ledger", "Attendance", "Adviser Actions"].forEach(function(name) {
    if (!spreadsheet.getSheetByName(name)) spreadsheet.insertSheet(name);
  });
  var actions = spreadsheet.getSheetByName("Adviser Actions");
  actions.getRange("A1:H2").setValues([
    ["ACTION_ID", "ACTION", "MEMBER_ID", "CATEGORY_CODE", "AMOUNT", "REASON", "STATUS", "PORTAL_RESULT"],
    ["", "", "", "", "", "", "DRAFT", ""]
  ]);
  actions.setFrozenRows(1);
  ScriptApp.newTrigger("adviserActionEdited").forSpreadsheet(spreadsheet).onEdit().create();
}

function postSignedEvent_(body) {
  var properties = PropertiesService.getScriptProperties();
  var baseUrl = properties.getProperty("POINTS_SYNC_URL");
  var secret = properties.getProperty("POINTS_SYNC_SECRET");
  if (!baseUrl || !secret) throw new Error("POINTS_SYNC_URL and POINTS_SYNC_SECRET script properties are required.");
  var raw = JSON.stringify(body);
  var timestamp = String(Math.floor(new Date().getTime() / 1000));
  var bytes = Utilities.computeHmacSha256Signature(timestamp + "." + raw, secret);
  var signature = bytes.map(function(byte) { var value = byte < 0 ? byte + 256 : byte; return ("0" + value.toString(16)).slice(-2); }).join("");
  var response = UrlFetchApp.fetch(baseUrl.replace(/\/$/, "") + "/api/points/sync/webhook", {
    method: "post",
    contentType: "application/json",
    payload: raw,
    muteHttpExceptions: true,
    headers: { "X-Sync-Timestamp": timestamp, "X-Sync-Signature": "sha256=" + signature }
  });
  if (response.getResponseCode() >= 300) throw new Error("Points sync rejected the event: " + response.getContentText());
}
