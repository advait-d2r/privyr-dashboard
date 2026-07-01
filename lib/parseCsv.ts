import Papa from "papaparse";
import { Activity, Lead } from "./types";
import {
  firstNameOnly,
  normalizeActivityType,
  normalizeLeadStage,
  normalizeSource,
  parseFirstResponseMins,
  parsePrivyrDate,
  parseTotalActivities,
} from "./normalize";

function parseCsvText(text: string): Record<string, string>[] {
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data;
}

/** Parses a Privyr Client List Export CSV into anonymized Lead rows. */
export function parseClientListCsv(text: string): Lead[] {
  const rows = parseCsvText(text);
  return rows.map((row) => {
    const totalActivities = parseTotalActivities(row["Total Activities"]);
    return {
      dateCreated: parsePrivyrDate(row["Date Created"]),
      source: normalizeSource(row["Source"]),
      teamMember: firstNameOnly(row["Assigned Team Member"]),
      leadStage: normalizeLeadStage(row["Lead Stage"]),
      totalActivities,
      firstResponseMins: parseFirstResponseMins(row["First Response (mins)"]),
      uncontacted: totalActivities === 0,
    };
  });
}

/** Parses a Privyr Timeline Activities Export CSV into anonymized Activity rows. */
export function parseTimelineActivitiesCsv(text: string): Activity[] {
  const rows = parseCsvText(text);
  return rows.map((row) => ({
    date: parsePrivyrDate(row["Activity Date"]),
    teamMember: firstNameOnly(row["Activity Created By"]),
    type: normalizeActivityType(row["Activity Type"]),
  }));
}
