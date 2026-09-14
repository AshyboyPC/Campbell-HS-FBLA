# Google Forms attendance

The portal accepts normalized submissions at:

```text
POST /api/points/integrations/attendance
```

Required headers:

```text
Content-Type: application/json
Authorization: Bearer YOUR_ATTENDANCE_WEBHOOK_SECRET
```

Normalized body:

```json
{
  "sourceType": "google_form",
  "sourceSubmissionId": "unique-form-response-id",
  "submittedAt": "2026-09-09T19:45:00Z",
  "eventCode": "CHAPTER-2026-09-09",
  "studentEmail": "student@campbellhigh.net",
  "memberId": "CFBLA-2027-0001",
  "serviceHours": null
}
```

## Apps Script pattern

Store `PORTAL_URL` and `ATTENDANCE_WEBHOOK_SECRET` in Apps Script Properties, not in the Sheet. Add an installable form-submit trigger for a function like this and adapt the named answers to the actual form:

```javascript
function sendAttendance(e) {
  const properties = PropertiesService.getScriptProperties();
  const answers = e.namedValues;
  const payload = {
    sourceType: 'google_form',
    sourceSubmissionId: String(e.range.getSheet().getSheetId()) + ':' + String(e.range.getRow()),
    submittedAt: new Date(e.values[0]).toISOString(),
    eventCode: String(answers['Event Code']?.[0] || '').trim(),
    studentEmail: String(answers['School Email']?.[0] || '').trim().toLowerCase(),
    memberId: String(answers['Member ID']?.[0] || '').trim(),
    serviceHours: answers['Verified Service Hours']?.[0] || null
  };

  UrlFetchApp.fetch(properties.getProperty('PORTAL_URL') + '/api/points/integrations/attendance', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + properties.getProperty('ATTENDANCE_WEBHOOK_SECRET') },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}
```

The API uses exact approved email/member-ID matching, verifies the event and attendance window, rejects duplicate submission IDs, and stages ambiguous rows for review.

## Historical backfill

Export the response Sheet as CSV. In `/points/manage/imports`, choose **General attendance**, map the submission ID, timestamp, event code, email/member ID, and optional service hours, preview, resolve exceptions, then confirm.
