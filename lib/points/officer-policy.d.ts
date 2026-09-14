export type OfficerPolicyState = {
  unexcusedCount: number;
  deduction: number;
  action: string;
  status: "good_standing" | "written_warning" | "probation" | "performance_review" | "removal_review";
  nextThreshold: number | null;
  removalRequiresHumanReview: boolean;
};
export const officerPolicyThresholds: ReadonlyArray<{threshold:number;deduction:number;action:string;status:string}>;
export function getOfficerPolicyState(unexcusedCount:number):OfficerPolicyState;
export function getOfficerPolicyDelta(unexcusedCount:number,existingPolicyTotal:number):{required:number;existing:number;delta:number};

