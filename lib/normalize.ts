import { ActivityCategory } from "./types";

/**
 * Privyr exports dates like "2026-07-01 - 18:02" in the account's local time.
 * We keep it as a plain "YYYY-MM-DD HH:mm" string (no timezone conversion at all)
 * so that grouping/sorting is identical no matter which timezone the server
 * or browser happens to run in. Never pass this through `new Date(...)`.
 */
export function parsePrivyrDate(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "-") return null;

  const match = trimmed.match(
    /^(\d{4})-(\d{2})-(\d{2})\s*-\s*(\d{2}):(\d{2})$/
  );
  if (!match) return null;

  const [, y, mo, d, h, mi] = match;
  // Validate the calendar date is real (e.g. rejects month 13, day 32).
  const check = new Date(Number(y), Number(mo) - 1, Number(d));
  if (
    check.getFullYear() !== Number(y) ||
    check.getMonth() !== Number(mo) - 1 ||
    check.getDate() !== Number(d)
  ) {
    return null;
  }

  return `${y}-${mo}-${d} ${h}:${mi}`;
}

/** Extracts "YYYY-MM-DD" from a parsePrivyrDate result. */
export function dateOnly(value: string | null): string | null {
  if (!value) return null;
  return value.slice(0, 10);
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Formats a "YYYY-MM-DD" string as "Jul 1, 2026" without any Date/timezone involvement. */
export function formatDateLabel(ymd: string): string {
  const [y, mo, d] = ymd.split("-").map(Number);
  return `${MONTHS[mo - 1]} ${d}, ${y}`;
}

/** Formats a "YYYY-MM-DD" string as "Jul 1" (compact, for chart axes). */
export function formatDateShort(ymd: string): string {
  const [, mo, d] = ymd.split("-").map(Number);
  return `${MONTHS[mo - 1]} ${d}`;
}

function isBlank(value: string | undefined | null): boolean {
  if (value === undefined || value === null) return true;
  const v = value.trim();
  return v === "" || v === "-" || v.toLowerCase() === "n/a";
}

/** "Roshni Vishwakarma (roshni.v@luxarea.in)" -> "Roshni" */
export function firstNameOnly(raw: string | undefined | null): string {
  if (isBlank(raw)) return "Unassigned";
  const withoutEmail = raw!.replace(/\(.*?\)/g, "").trim();
  const first = withoutEmail.split(/\s+/)[0];
  return first || "Unassigned";
}

export function normalizeSource(raw: string | undefined | null): string {
  if (isBlank(raw)) return "Unspecified";
  const v = raw!.trim();
  const map: Record<string, string> = {
    EXTERNAL_INTEGRATION: "External Integration",
  };
  return map[v] || v;
}

export function normalizeLeadStage(raw: string | undefined | null): string {
  if (isBlank(raw)) return "Unspecified";
  return raw!.trim();
}

export function parseTotalActivities(raw: string | undefined | null): number {
  if (isBlank(raw)) return 0;
  const n = parseInt(raw!.trim(), 10);
  return isNaN(n) ? 0 : n;
}

export function parseFirstResponseMins(
  raw: string | undefined | null
): number | null {
  if (isBlank(raw)) return null;
  const n = parseFloat(raw!.trim());
  return isNaN(n) ? null : n;
}

export function normalizeActivityType(
  raw: string | undefined | null
): ActivityCategory {
  if (isBlank(raw)) return "Other";
  const v = raw!.toLowerCase();
  if (v.includes("call")) return "Phone Call";
  if (
    v.includes("message") ||
    v.includes("whatsapp") ||
    v.includes("sms") ||
    v.includes("content") ||
    v.includes("template")
  )
    return "Message";
  if (v.includes("note")) return "Note";
  return "Other";
}
