import { Activity, ActivityCategory, Lead } from "./types";
import { dateOnly, hourOfDay } from "./normalize";

export interface FilterState {
  dateFrom: string | null; // "YYYY-MM-DD", inclusive
  dateTo: string | null; // "YYYY-MM-DD", inclusive
  sources: string[]; // empty = all
  teamMembers: string[]; // empty = all
  leadStages: string[]; // empty = all
}

export const EMPTY_FILTERS: FilterState = {
  dateFrom: null,
  dateTo: null,
  sources: [],
  teamMembers: [],
  leadStages: [],
};

function inDateRange(
  ymd: string | null,
  from: string | null,
  to: string | null
): boolean {
  if (!ymd) return !from && !to; // unparseable dates only shown when no date filter applied
  if (from && ymd < from) return false;
  if (to && ymd > to) return false;
  return true;
}

export function filterLeads(leads: Lead[], f: FilterState): Lead[] {
  return leads.filter((lead) => {
    if (!inDateRange(dateOnly(lead.dateCreated), f.dateFrom, f.dateTo))
      return false;
    if (f.sources.length && !f.sources.includes(lead.source)) return false;
    if (f.teamMembers.length && !f.teamMembers.includes(lead.teamMember))
      return false;
    if (f.leadStages.length && !f.leadStages.includes(lead.leadStage))
      return false;
    return true;
  });
}

export function filterActivities(
  activities: Activity[],
  f: FilterState
): Activity[] {
  return activities.filter((a) => {
    if (!inDateRange(dateOnly(a.date), f.dateFrom, f.dateTo)) return false;
    if (f.teamMembers.length && !f.teamMembers.includes(a.teamMember))
      return false;
    return true;
  });
}

export interface CountEntry {
  key: string;
  count: number;
}

export function countBy<T>(items: T[], keyFn: (item: T) => string): CountEntry[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const key = keyFn(item);
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map.entries())
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count);
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export interface AverageEntry {
  key: string;
  avg: number | null;
  count: number;
}

export function averageBy<T>(
  items: T[],
  keyFn: (item: T) => string,
  valueFn: (item: T) => number | null
): AverageEntry[] {
  const map = new Map<string, number[]>();
  for (const item of items) {
    const value = valueFn(item);
    if (value === null) continue;
    const key = keyFn(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(value);
  }
  return Array.from(map.entries())
    .map(([key, values]) => ({ key, avg: average(values), count: values.length }))
    .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));
}

/**
 * All distinct "YYYY-MM-DD" days between the earliest and latest date present, inclusive.
 * Accepts either "YYYY-MM-DD" or "YYYY-MM-DD HH:mm" strings.
 */
export function fullDateRange(dates: (string | null)[]): string[] {
  const days = dates
    .map((d) => dateOnly(d))
    .filter((d): d is string => !!d)
    .sort();
  if (days.length === 0) return [];
  const min = days[0];
  const max = days[days.length - 1];
  const result: string[] = [];
  const [minY, minM, minD] = min.split("-").map(Number);
  const [maxY, maxM, maxD] = max.split("-").map(Number);
  const cursor = new Date(Date.UTC(minY, minM - 1, minD));
  const end = new Date(Date.UTC(maxY, maxM - 1, maxD));
  while (cursor.getTime() <= end.getTime()) {
    const y = cursor.getUTCFullYear();
    const m = String(cursor.getUTCMonth() + 1).padStart(2, "0");
    const d = String(cursor.getUTCDate()).padStart(2, "0");
    result.push(`${y}-${m}-${d}`);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return result;
}

export interface DateSeriesPoint {
  date: string;
  count: number;
}

export function countByDateSeries(dates: (string | null)[]): DateSeriesPoint[] {
  const days = fullDateRange(dates);
  const counts = new Map<string, number>();
  for (const d of dates) {
    const ymd = dateOnly(d);
    if (!ymd) continue;
    counts.set(ymd, (counts.get(ymd) || 0) + 1);
  }
  return days.map((date) => ({ date, count: counts.get(date) || 0 }));
}

export interface HourCount {
  hour: number; // 0-23
  count: number;
}

/** Counts leads by hour of day (0-23), across whatever date range is present. */
export function leadsByHourOfDay(dates: (string | null)[]): HourCount[] {
  const counts = new Array(24).fill(0);
  for (const d of dates) {
    const hour = hourOfDay(d);
    if (hour === null) continue;
    counts[hour] += 1;
  }
  return counts.map((count, hour) => ({ hour, count }));
}

export interface AvgDateSeriesPoint {
  date: string;
  avg: number | null;
}

export function avgByDateSeries(
  items: { date: string | null; value: number | null }[]
): AvgDateSeriesPoint[] {
  const days = fullDateRange(items.map((i) => i.date));
  const byDay = new Map<string, number[]>();
  for (const { date, value } of items) {
    const ymd = dateOnly(date);
    if (!ymd || value === null) continue;
    if (!byDay.has(ymd)) byDay.set(ymd, []);
    byDay.get(ymd)!.push(value);
  }
  return days.map((date) => ({ date, avg: average(byDay.get(date) || []) }));
}

/** Stacked series: one count per (date, groupKey) pair, for stacked bar charts. */
export function stackedByDate<T>(
  items: T[],
  dateFn: (item: T) => string | null,
  groupFn: (item: T) => string
): { dates: string[]; groups: string[]; data: Record<string, number | string>[] } {
  const dates = fullDateRange(items.map(dateFn));
  const groupSet = new Set<string>();
  const cell = new Map<string, number>(); // `${date}|${group}` -> count

  for (const item of items) {
    const ymd = dateOnly(dateFn(item));
    if (!ymd) continue;
    const group = groupFn(item);
    groupSet.add(group);
    const key = `${ymd}|${group}`;
    cell.set(key, (cell.get(key) || 0) + 1);
  }

  const groups = Array.from(groupSet).sort();
  const data = dates.map((date) => {
    const row: Record<string, number | string> = { date };
    for (const g of groups) {
      row[g] = cell.get(`${date}|${g}`) || 0;
    }
    return row;
  });

  return { dates, groups, data };
}

export interface ActivityTypeCounts {
  "Phone Call": number;
  Message: number;
  Note: number;
  Other: number;
}

export function activityTypeCounts(activities: Activity[]): ActivityTypeCounts {
  const counts: ActivityTypeCounts = {
    "Phone Call": 0,
    Message: 0,
    Note: 0,
    Other: 0,
  };
  for (const a of activities) {
    counts[a.type as ActivityCategory] += 1;
  }
  return counts;
}

/** Cross-tabulates items into a row-category x column-category grid, for grouped/stacked bar charts. */
export function crossTab<T>(
  items: T[],
  rowFn: (item: T) => string,
  colFn: (item: T) => string,
  colOrder?: string[]
): { rows: string[]; cols: string[]; data: Record<string, number | string>[] } {
  const rowTotals = new Map<string, number>();
  const colSet = new Set<string>(colOrder ?? []);
  const cell = new Map<string, number>();

  for (const item of items) {
    const r = rowFn(item);
    const c = colFn(item);
    if (!colOrder) colSet.add(c);
    rowTotals.set(r, (rowTotals.get(r) || 0) + 1);
    const key = `${r}|${c}`;
    cell.set(key, (cell.get(key) || 0) + 1);
  }

  const rows = Array.from(rowTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([r]) => r);
  const cols = colOrder ?? Array.from(colSet);

  const data = rows.map((r) => {
    const row: Record<string, number | string> = { row: r };
    for (const c of cols) {
      row[c] = cell.get(`${r}|${c}`) || 0;
    }
    return row;
  });

  return { rows, cols, data };
}

export interface TeamSummaryRow {
  teamMember: string;
  totalLeads: number;
  uncontactedLeads: number;
  uncontactedPct: number | null;
  avgFirstResponseMins: number | null;
  totalActivities: number;
  calls: number;
  messages: number;
  notes: number;
  other: number;
}

export function buildTeamSummary(
  leads: Lead[],
  activities: Activity[]
): TeamSummaryRow[] {
  const members = new Set<string>();
  leads.forEach((l) => members.add(l.teamMember));
  activities.forEach((a) => members.add(a.teamMember));

  return Array.from(members)
    .map((teamMember) => {
      const memberLeads = leads.filter((l) => l.teamMember === teamMember);
      const memberActivities = activities.filter(
        (a) => a.teamMember === teamMember
      );
      const uncontactedLeads = memberLeads.filter((l) => l.uncontacted).length;
      const responseTimes = memberLeads
        .map((l) => l.firstResponseMins)
        .filter((v): v is number => v !== null);
      const typeCounts = activityTypeCounts(memberActivities);

      return {
        teamMember,
        totalLeads: memberLeads.length,
        uncontactedLeads,
        uncontactedPct:
          memberLeads.length > 0
            ? (uncontactedLeads / memberLeads.length) * 100
            : null,
        avgFirstResponseMins: average(responseTimes),
        totalActivities: memberActivities.length,
        calls: typeCounts["Phone Call"],
        messages: typeCounts["Message"],
        notes: typeCounts["Note"],
        other: typeCounts["Other"],
      };
    })
    .sort((a, b) => b.totalLeads - a.totalLeads);
}
