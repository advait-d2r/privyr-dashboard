"use client";

import { FilterState } from "@/lib/aggregate";
import { MultiSelect } from "./MultiSelect";

export function FilterBar({
  filters,
  onChange,
  sourceOptions,
  teamMemberOptions,
  leadStageOptions,
  onReset,
  isFiltered,
}: {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  sourceOptions: string[];
  teamMemberOptions: string[];
  leadStageOptions: string[];
  onReset: () => void;
  isFiltered: boolean;
}) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) =>
              onChange({ ...filters, dateFrom: e.target.value || null })
            }
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700"
            aria-label="Date from"
          />
          <span className="text-slate-400 text-sm">to</span>
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) =>
              onChange({ ...filters, dateTo: e.target.value || null })
            }
            className="rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm text-slate-700"
            aria-label="Date to"
          />
        </div>

        <MultiSelect
          label="Source"
          options={sourceOptions}
          selected={filters.sources}
          onChange={(sources) => onChange({ ...filters, sources })}
        />
        <MultiSelect
          label="Team"
          options={teamMemberOptions}
          selected={filters.teamMembers}
          onChange={(teamMembers) => onChange({ ...filters, teamMembers })}
        />
        <MultiSelect
          label="Stage"
          options={leadStageOptions}
          selected={filters.leadStages}
          onChange={(leadStages) => onChange({ ...filters, leadStages })}
        />

        {isFiltered && (
          <button
            type="button"
            onClick={onReset}
            className="ml-auto text-sm text-slate-500 hover:text-slate-800 underline underline-offset-2"
          >
            Reset filters
          </button>
        )}
      </div>
    </div>
  );
}
