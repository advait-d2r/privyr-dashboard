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

/** Extracts the hour (0-23) from a parsePrivyrDate result. */
export function hourOfDay(value: string | null): number | null {
  if (!value) return null;
  const match = value.match(/^\d{4}-\d{2}-\d{2} (\d{2}):\d{2}$/);
  if (!match) return null;
  return Number(match[1]);
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

const HOUR_LABELS = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM",
  "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM",
  "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM",
  "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
];

const HOUR_LABELS_SHORT = [
  "12a", "1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a",
  "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p",
];

/** Formats an hour (0-23) as "6 PM", for tooltips. */
export function formatHourLabel(hour: number): string {
  return HOUR_LABELS[hour] ?? String(hour);
}

/** Formats an hour (0-23) as "6p", for compact chart axes. */
export function formatHourShort(hour: number): string {
  return HOUR_LABELS_SHORT[hour] ?? String(hour);
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
