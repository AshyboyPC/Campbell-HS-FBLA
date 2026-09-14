import test from "node:test";
import assert from "node:assert/strict";
import { getOfficerPolicyDelta, getOfficerPolicyState } from "../lib/points/officer-policy.js";

test("officer deductions are cumulative totals, not stacked thresholds", () => {
  const expected = [0, -5, -5, -10, -10, -15, -15, -20, -20];
  expected.forEach((deduction, count) => assert.equal(getOfficerPolicyState(count).deduction, deduction));
});

test("correcting three unexcused absences to two creates only a +5 delta", () => {
  assert.deepEqual(getOfficerPolicyDelta(2, -10), { required: -5, existing: -10, delta: 5 });
});

test("seven absences flags review but never auto-removes an officer", () => {
  const state = getOfficerPolicyState(7);
  assert.equal(state.deduction, -20);
  assert.equal(state.removalRequiresHumanReview, true);
  assert.equal(state.status, "removal_review");
});

