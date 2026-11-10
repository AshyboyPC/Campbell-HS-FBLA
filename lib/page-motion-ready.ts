export const PAGE_MOTION_READY_EVENT = "campbell:page-motion-ready";

export function resetPageMotionReady(pathname: string) {
  document.documentElement.dataset.pageMotionPath = pathname;
  document.documentElement.dataset.pageMotionReady = "false";
}

export function markPageMotionReady(pathname: string) {
  document.documentElement.dataset.pageMotionPath = pathname;
  document.documentElement.dataset.pageMotionReady = "true";
  document.dispatchEvent(new Event(PAGE_MOTION_READY_EVENT));
}

export function isPageMotionReady(pathname: string) {
  const root = document.documentElement;
  return root.dataset.pageMotionReady === "true" && root.dataset.pageMotionPath === pathname;
}
