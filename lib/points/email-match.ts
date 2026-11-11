/** Treat a small typo as a suggestion only. Authentication still requires an exact address. */
export function isSimilarEmail(verified: string, saved: string) {
  const [local, domain, ...extra] = verified.trim().toLowerCase().split("@");
  const [other, otherDomain, ...otherExtra] = saved.trim().toLowerCase().split("@");
  if (extra.length || otherExtra.length || !domain || domain !== otherDomain || !local || !other) return false;
  if (local === other || Math.min(local.length, other.length) < 5 || Math.abs(local.length - other.length) > 1) return false;

  let index = 0;
  while (index < Math.min(local.length, other.length) && local[index] === other[index]) index++;
  if (local.length === other.length) {
    return local.slice(index + 1) === other.slice(index + 1)
      || (local[index] === other[index + 1] && local[index + 1] === other[index]
        && local.slice(index + 2) === other.slice(index + 2));
  }
  const [shorter, longer] = local.length < other.length ? [local, other] : [other, local];
  return shorter.slice(index) === longer.slice(index + 1);
}
