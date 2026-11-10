# Google Workspace sync bridge

This bridge connects the all-activity Google Form and the adviser ledger to the portal without exposing Google credentials in the browser.

1. Apply the `202609200009_google_sync_foundation.sql` migration.
2. Create a Google service account and share the adviser Sheet with its client email as an editor. Share the attendance Form with that account when Forms API reconciliation is enabled.
3. Set the server variables documented in `.env.example`.
4. Paste the Form and Sheet links into **Adviser Console → Events & sync**.
5. In the Sheet, open **Extensions → Apps Script**, add `Code.gs`, and set the `POINTS_SYNC_URL` and `POINTS_SYNC_SECRET` script properties.
6. Run `installPointsSync` once and approve the requested Google permissions.
7. In the attendance Form’s Apps Script project, install `attendanceFormSubmitted` as an “On form submit” trigger.

The read-only `Members`, `Point Ledger`, and `Attendance` tabs are server snapshots. Advisers should never edit totals there. Proposed changes belong in `Adviser Actions`; the portal journals them for validation and review instead of trusting arbitrary cell edits.
