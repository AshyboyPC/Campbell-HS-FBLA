import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const MAX_CLOCK_SKEW_SECONDS = 5 * 60;

export function sha256(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function verifySyncSignature(rawBody: string, timestamp: string | null, signature: string | null) {
  const secret = process.env.GOOGLE_SYNC_WEBHOOK_SECRET;
  if (!secret || !timestamp || !signature) return false;
  const seconds = Number(timestamp);
  if (!Number.isFinite(seconds) || Math.abs(Date.now() / 1000 - seconds) > MAX_CLOCK_SKEW_SECONDS) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");
  const received = signature.replace(/^sha256=/i, "");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
