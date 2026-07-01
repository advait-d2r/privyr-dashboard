import { TeamSummaryRow } from "@/lib/aggregate";
import { fmtMins, fmtPct } from "@/lib/format";

export function TeamSummaryTable({ rows }: { rows: TeamSummaryRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="h-24 flex items-center justify-center text-sm text-slate-400">
        No data for this selection
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-5 px-5">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-200">
            <th className="py-2 pr-4 font-medium">Team Member</th>
            <th className="py-2 pr-4 font-medium text-right">Leads</th>
            <th className="py-2 pr-4 font-medium text-right">Uncontacted</th>
            <th className="py-2 pr-4 font-medium text-right">Uncontacted %</th>
            <th className="py-2 pr-4 font-medium text-right">Avg 1st Response</th>
            <th className="py-2 pr-4 font-medium text-right">Calls</th>
            <th className="py-2 pr-4 font-medium text-right">Messages</th>
            <th className="py-2 pr-4 font-medium text-right">Notes</th>
            <th className="py-2 pr-0 font-medium text-right">Total Activities</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.teamMember}
              className="border-b border-slate-100 last:border-0"
            >
              <td className="py-2.5 pr-4 font-medium text-slate-800">
                {row.teamMember}
              </td>
              <td className="py-2.5 pr-4 text-right text-slate-700">
                {row.totalLeads}
              </td>
              <td className="py-2.5 pr-4 text-right text-slate-700">
                {row.uncontactedLeads}
              </td>
              <td className="py-2.5 pr-4 text-right">
                <span
                  className={
                    row.uncontactedPct !== null && row.uncontactedPct >= 50
                      ? "text-red-600 font-medium"
                      : "text-slate-700"
                  }
                >
                  {fmtPct(row.uncontactedPct)}
                </span>
              </td>
              <td className="py-2.5 pr-4 text-right text-slate-700">
                {fmtMins(row.avgFirstResponseMins)}
              </td>
              <td className="py-2.5 pr-4 text-right text-slate-700">
                {row.calls}
              </td>
              <td className="py-2.5 pr-4 text-right text-slate-700">
                {row.messages}
              </td>
              <td className="py-2.5 pr-4 text-right text-slate-700">
                {row.notes}
              </td>
              <td className="py-2.5 pr-0 text-right font-medium text-slate-900">
                {row.totalActivities}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
