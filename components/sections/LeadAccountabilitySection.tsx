"use client";

import { useMemo } from "react";
import { Lead } from "@/lib/types";
import { shareByTeamMember } from "@/lib/aggregate";
import { fmtNumber } from "@/lib/format";
import { Card } from "../Card";
import { DonutChart } from "../charts/DonutChart";
import { ShareTable } from "../ShareTable";

export function LeadAccountabilitySection({ leads }: { leads: Lead[] }) {
  const { uncontactedShare, unspecifiedShare, uncontactedTotal, unspecifiedTotal } =
    useMemo(() => {
      const uncontactedLeads = leads.filter((l) => l.uncontacted);
      const unspecifiedLeads = leads.filter((l) => l.leadStage === "Unspecified");
      return {
        uncontactedShare: shareByTeamMember(uncontactedLeads),
        unspecifiedShare: shareByTeamMember(unspecifiedLeads),
        uncontactedTotal: uncontactedLeads.length,
        unspecifiedTotal: unspecifiedLeads.length,
      };
    }, [leads]);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">
        Lead Accountability by Salesperson
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Who the uncontacted and unspecified-stage leads are currently assigned to.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card
          title="Uncontacted Leads by Salesperson"
          subtitle={`${fmtNumber(uncontactedTotal)} total uncontacted leads`}
        >
          <DonutChart data={uncontactedShare} />
          <div className="mt-4">
            <ShareTable data={uncontactedShare} />
          </div>
        </Card>
        <Card
          title="Unspecified Stage Leads by Salesperson"
          subtitle={`${fmtNumber(unspecifiedTotal)} total unspecified-stage leads`}
        >
          <DonutChart data={unspecifiedShare} />
          <div className="mt-4">
            <ShareTable data={unspecifiedShare} />
          </div>
        </Card>
      </div>
    </section>
  );
}
