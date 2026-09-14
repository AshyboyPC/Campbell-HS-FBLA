# Microsoft Forms attendance

Use Power Automate with **When a new response is submitted** and **Get response details**, followed by an HTTP action to:

```text
POST https://YOUR_SITE/api/points/integrations/attendance
```

Headers:

```text
Content-Type: application/json
Authorization: Bearer YOUR_ATTENDANCE_WEBHOOK_SECRET
```

Body shape:

```json
{
  "sourceType": "microsoft_form",
  "sourceSubmissionId": "@{triggerOutputs()?['body/resourceData/responseId']}",
  "submittedAt": "@{utcNow()}",
  "eventCode": "CHAPTER-2026-09-09",
  "studentEmail": "NORMALIZED_CAMPBELLHIGH.NET_RESPONDER_EMAIL",
  "memberId": "OPTIONAL_MEMBER_ID",
  "serviceHours": null
}
```

Keep the secret in a secured environment variable or protected flow configuration. Do not put it in visible form fields.

For historical data, export Forms responses to Excel, save as CSV, then use `/points/manage/imports` with **General attendance**. Preview is mandatory; fuzzy name matching is never used.
