# Microsoft Teams officer attendance

Teams attendance reports are evidence, not disciplinary decisions.

## Workflow

1. Create the officer meeting as an `officer_team_meeting` event and mark it required for officers.
2. Download the Teams attendance report as CSV.
3. Open `/points/manage/imports` and choose **Teams officer attendance**.
4. Map participant name/email, first join, last leave, total minutes, and event code.
5. Preview and confirm exact matches.
6. Review the resulting records at `/points/manage/officer-attendance`.

The import may suggest:

- present
- late when first join is 10 or more minutes after the scheduled start
- early-departure review
- unmatched officer

Every imported officer record remains `pending_review` until an authorized person checks absence notice, emergencies, and meeting context and confirms the classification. Teams evidence alone never creates a warning, deduction, probation, or role change.
