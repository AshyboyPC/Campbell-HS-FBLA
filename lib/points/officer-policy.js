/** Exact cumulative Campbell FBLA officer policy effective August 28, 2026. */
export const officerPolicyThresholds = Object.freeze([
  { threshold: 1, deduction: -5, action: "Written warning", status: "written_warning" },
  { threshold: 3, deduction: -10, action: "Leadership check-in + probation", status: "probation" },
  { threshold: 5, deduction: -15, action: "Adviser involvement + performance review", status: "performance_review" },
  { threshold: 7, deduction: -20, action: "Removal threshold — human review required", status: "removal_review" },
]);

/** @param {number} unexcusedCount */
export function getOfficerPolicyState(unexcusedCount) {
  const count = Math.max(0, Math.floor(Number(unexcusedCount) || 0));
  const reached = [...officerPolicyThresholds].reverse().find((item) => count >= item.threshold);
  const next = officerPolicyThresholds.find((item) => count < item.threshold) ?? null;
  return {
    unexcusedCount: count,
    deduction: reached?.deduction ?? 0,
    action: reached?.action ?? "Good standing",
    status: reached?.status ?? "good_standing",
    nextThreshold: next?.threshold ?? null,
    removalRequiresHumanReview: count >= 7,
  };
}

/** @param {number} unexcusedCount @param {number} existingPolicyTotal */
export function getOfficerPolicyDelta(unexcusedCount, existingPolicyTotal) {
  const required = getOfficerPolicyState(unexcusedCount).deduction;
  return { required, existing: Number(existingPolicyTotal) || 0, delta: required - (Number(existingPolicyTotal) || 0) };
}

