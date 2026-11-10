#!/usr/bin/env python3
"""Validate and safely upsert the visible membership-form roster.

The source workbook is never copied into the repository. Only visible rows are
considered approved, and only first name, last name, grade, and personal email
are read. Phone and guardian fields are deliberately ignored.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import urllib.error
from collections import Counter
from datetime import date, datetime
from pathlib import Path

import openpyxl


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text().splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def normalized(value: object) -> str:
    return re.sub(r"[^a-z0-9]", "", str(value or "").lower())


def clean(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "")).strip()


def grade_number(value: object) -> str | None:
    text = clean(value).lower()
    names = {"freshman": "9", "sophomore": "10", "junior": "11", "senior": "12"}
    if text in names:
        return names[text]
    match = re.search(r"(?:^|\D)(9|10|11|12)(?:\D|$)", text)
    return match.group(1) if match else None


def graduation_year(grade: str, school_year_end: int) -> int:
    return school_year_end + (12 - int(grade))


class SupabaseRest:
    def __init__(self) -> None:
        self.url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
        self.key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        if not self.url or not self.key:
            raise RuntimeError("Supabase service credentials are not configured.")

    def request(self, method: str, path: str, body: object | None = None, prefer: str | None = None):
        headers = {"apikey": self.key, "authorization": f"Bearer {self.key}", "content-type": "application/json"}
        if prefer:
            headers["prefer"] = prefer
        data = json.dumps(body).encode() if body is not None else None
        request = urllib.request.Request(f"{self.url}/rest/v1/{path}", data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request) as response:
                raw = response.read()
                return json.loads(raw) if raw else None
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", "replace")
            raise RuntimeError(f"Supabase request failed ({error.code}): {detail}") from error


def source_rows(path: Path) -> list[dict[str, object]]:
    workbook = openpyxl.load_workbook(path, read_only=False, data_only=True)
    sheet = workbook[workbook.sheetnames[0]]
    headers = {clean(sheet.cell(1, column).value): column for column in range(1, sheet.max_column + 1)}
    required = ["First Name", "Last Name", "Grade", "PERSONAL Email"]
    if any(name not in headers for name in required):
        raise RuntimeError(f"Missing required source columns: {', '.join(name for name in required if name not in headers)}")
    rows = []
    for row_number in range(2, sheet.max_row + 1):
        if sheet.row_dimensions[row_number].hidden:
            continue
        first = clean(sheet.cell(row_number, headers["First Name"]).value)
        last = clean(sheet.cell(row_number, headers["Last Name"]).value)
        email = clean(sheet.cell(row_number, headers["PERSONAL Email"]).value).lower()
        grade = grade_number(sheet.cell(row_number, headers["Grade"]).value)
        rows.append({"row": row_number, "timestamp": sheet.cell(row_number, headers["Timestamp"]).value, "first_name": first, "last_name": last, "name": clean(f"{first} {last}"), "email": email, "grade": grade})
    return rows


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--school-year-end", type=int, default=2027)
    args = parser.parse_args()
    load_env(Path(".env.local"))
    source_all = source_rows(args.workbook)
    db = SupabaseRest()
    roster = db.request("GET", "band_roster_members?select=id,roster_number,canonical_name,aliases,grade_level,roster_kind,officer_position,active&active=eq.true&order=roster_number")
    profiles = db.request("GET", "profiles?select=id,member_id,approved_auth_email,auth_user_id,first_name,last_name,grade_level,graduation_year,account_role,officer_position")
    identity_mappings = db.request("GET", "external_identity_mappings?select=profile_id,provider,external_identifier&provider=in.(personal_google,google_form)")

    email_counts = Counter(row["email"] for row in source_all if row["email"])
    invalid = [row for row in source_all if not row["first_name"] or not row["last_name"] or not row["grade"] or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", str(row["email"]))]
    duplicate_emails = sorted(email for email, count in email_counts.items() if count > 1)
    duplicate_groups = [[row for row in source_all if row["email"] == email] for email in duplicate_emails]
    # Repeated form submissions by the same email are one identity. The latest
    # visible response wins, but only after every duplicate resolves to the same
    # normalized name; conflicting shared-email submissions remain blocked.
    duplicate_identity_conflicts = [group for group in duplicate_groups if len({normalized(row["name"]) for row in group}) > 1]
    latest_by_email: dict[str, dict[str, object]] = {}
    for row in source_all:
        prior = latest_by_email.get(str(row["email"]))
        if prior is None or str(row["timestamp"]) >= str(prior["timestamp"]):
            latest_by_email[str(row["email"])] = row
    source = list(latest_by_email.values())
    roster_index: dict[str, list[dict]] = {}
    for member in roster:
        for candidate in [member["canonical_name"], *(member.get("aliases") or [])]:
            roster_index.setdefault(normalized(candidate), []).append(member)
    matches, unmatched, ambiguous = [], [], []
    for row in source:
        candidates = {member["id"]: member for member in roster_index.get(normalized(row["name"]), [])}
        if len(candidates) == 1:
            matches.append((row, next(iter(candidates.values()))))
        elif len(candidates) > 1:
            ambiguous.append(row)
        else:
            unmatched.append(row)

    matched_roster_ids = {member["id"] for _, member in matches}
    missing_roster = [member for member in roster if member["id"] not in matched_roster_ids]
    profile_by_id = {profile["id"]: profile for profile in profiles}
    profile_by_email = {str(profile.get("approved_auth_email") or "").lower(): profile for profile in profiles if profile.get("approved_auth_email")}
    for mapping in identity_mappings:
        if mapping["provider"] == "personal_google" and mapping["profile_id"] in profile_by_id:
            profile_by_email[str(mapping["external_identifier"]).lower()] = profile_by_id[mapping["profile_id"]]
    conflicts = []
    for row, member in matches:
        existing = profile_by_email.get(str(row["email"]))
        if existing and normalized(f"{existing.get('first_name','')} {existing.get('last_name','')}") != normalized(row["name"]):
            conflicts.append({"row": row["row"], "name": row["name"], "reason": "email already belongs to another portal profile"})

    report = {
        "visible_source_rows": len(source_all),
        "deduplicated_identity_rows": len(source),
        "valid_identity_rows": len(source_all) - len(invalid),
        "unique_personal_emails": len(email_counts),
        "duplicate_email_count": len(duplicate_emails),
        "duplicate_email_groups": [[{"row": row["row"], "name": row["name"], "timestamp": str(row["timestamp"])} for row in group] for group in duplicate_groups],
        "duplicate_identity_conflict_count": len(duplicate_identity_conflicts),
        "matched_to_band_roster": len(matches),
        "unmatched_source_count": len(unmatched),
        "ambiguous_source_count": len(ambiguous),
        "missing_band_roster_count": len(missing_roster),
        "existing_profile_conflict_count": len(conflicts),
        "grade_counts": dict(sorted(Counter(str(row["grade"] or "missing") for row in source).items())),
        "unmatched_source": [{"row": row["row"], "name": row["name"], "grade": row["grade"]} for row in unmatched],
        "ambiguous_source": [{"row": row["row"], "name": row["name"]} for row in ambiguous],
        "missing_band_roster": [{"roster_number": member["roster_number"], "name": member["canonical_name"], "kind": member["roster_kind"]} for member in missing_roster],
        "invalid_rows": [{"row": row["row"], "name": row["name"], "missing_email": not bool(row["email"]), "missing_grade": not bool(row["grade"])} for row in invalid],
        "conflicts": conflicts,
    }
    print(json.dumps(report, indent=2))

    blocking = invalid or duplicate_identity_conflicts or ambiguous or conflicts
    if not args.apply:
        return 2 if blocking else 0
    if blocking:
        print("Apply refused because identity validation has unresolved issues.", file=sys.stderr)
        return 2

    now = datetime.now().astimezone().isoformat()
    for row, member in matches:
        existing = profile_by_email.get(str(row["email"]))
        if not existing:
            name_matches = [profile for profile in profiles if normalized(f"{profile.get('first_name','')} {profile.get('last_name','')}") == normalized(row["name"])]
            if len(name_matches) == 1:
                existing = name_matches[0]
        role = "officer" if member["roster_kind"] == "officer" else "member"
        payload = {
            "first_name": row["first_name"], "last_name": row["last_name"], "display_name": row["name"],
            # Until the personal-email migration is applied, keep the identity
            # in the service-only mapping table instead of the legacy
            # school-domain-constrained profile column.
            "approved_auth_email": None, "grade_level": row["grade"],
            "graduation_year": graduation_year(str(row["grade"]), args.school_year_end),
            "membership_status": "active", "account_role": role, "officer_position": member.get("officer_position"),
            "active": True, "approved": True, "roster_match_status": "known_member",
            "band_display_name": member["canonical_name"], "updated_at": now,
        }
        if existing:
            identifier = urllib.parse.quote(str(existing["id"]), safe="")
            db.request("PATCH", f"profiles?id=eq.{identifier}", payload, "return=minimal")
            profile_id = existing["id"]
        else:
            payload.update({"member_id": "", "onboarding_completed": False, "join_date": date.today().isoformat()})
            created = db.request("POST", "profiles?select=id", payload, "return=representation")
            profile_id = created[0]["id"]
        for provider in ("personal_google", "google_form"):
            db.request("POST", "external_identity_mappings?on_conflict=provider,external_identifier", {"profile_id": profile_id, "provider": provider, "external_identifier": row["email"]}, "resolution=merge-duplicates,return=minimal")
    print(json.dumps({"applied": len(matches), "created_or_updated_at": now}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
