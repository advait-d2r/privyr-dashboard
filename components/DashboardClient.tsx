"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DashboardData } from "@/lib/types";
import { EMPTY_FILTERS, FilterState, filterActivities, filterLeads } from "@/lib/aggregate";
import { FilterBar } from "./FilterBar";
import { LeadOverviewSection } from "./sections/LeadOverviewSection";
import { TeamProductivitySection } from "./sections/TeamProductivitySection";
import { TeamSummarySection } from "./sections/TeamSummarySection";

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function DashboardClient({ data }: { data: DashboardData }) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);

  const sourceOptions = useMemo(
    () => uniqueSorted(data.leads.map((l) => l.source)),
    [data.leads]
  );
  const teamMemberOptions = useMemo(
    () =>
      uniqueSorted([
        ...data.leads.map((l) => l.teamMember),
        ...data.activities.map((a) => a.teamMember),
      ]),
    [data.leads, data.activities]
  );
  const leadStageOptions = useMemo(
    () => uniqueSorted(data.leads.map((l) => l.leadStage)),
    [data.leads]
  );

  const filteredLeads = useMemo(
    () => filterLeads(data.leads, filters),
    [data.leads, filters]
  );
  const filteredActivities = useMemo(
    () => filterActivities(data.activities, filters),
    [data.activities, filters]
  );

  const isFiltered =
    !!filters.dateFrom ||
    !!filters.dateTo ||
    filters.sources.length > 0 ||
    filters.teamMembers.length > 0 ||
    filters.leadStages.length > 0;

  const uploadedAt = new Date(data.uploadedAt);

  return (
    <div>
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              VPP Sales Dashboard - Avenor Park
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Data last updated{" "}
              {uploadedAt.toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
          <Link
            href="/upload"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 hover:border-slate-400 transition"
          >
            Update Data
          </Link>
        </div>
      </header>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        sourceOptions={sourceOptions}
        teamMemberOptions={teamMemberOptions}
        leadStageOptions={leadStageOptions}
        onReset={() => setFilters(EMPTY_FILTERS)}
        isFiltered={isFiltered}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-10">
        <LeadOverviewSection leads={filteredLeads} />
        <TeamProductivitySection activities={filteredActivities} />
        <TeamSummarySection leads={filteredLeads} activities={filteredActivities} />
      </main>

      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-center text-xs text-slate-400">
        Macro-level view only — no individual client names, phone numbers, or
        emails are shown.
      </footer>
    </div>
  );
}
