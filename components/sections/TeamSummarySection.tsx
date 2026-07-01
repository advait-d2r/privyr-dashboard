"use client";

import { useMemo } from "react";
import { Lead, Activity } from "@/lib/types";
import { buildTeamSummary } from "@/lib/aggregate";
import { Card } from "../Card";
import { TeamSummaryTable } from "../TeamSummaryTable";

export function TeamSummarySection({
  leads,
  activities,
}: {
  leads: Lead[];
  activities: Activity[];
}) {
  const rows = useMemo(
    () => buildTeamSummary(leads, activities),
    [leads, activities]
  );

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        3. Team Performance Summary
      </h2>
      <Card>
        <TeamSummaryTable rows={rows} />
      </Card>
    </section>
  );
}
