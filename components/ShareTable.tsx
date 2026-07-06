import { ShareEntry } from "@/lib/aggregate";

export function ShareTable({ data }: { data: ShareEntry[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4">
        No leads in this category
      </p>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-200">
          <th className="py-2 pr-4 font-medium">Salesperson</th>
          <th className="py-2 pr-4 font-medium text-right">Count</th>
          <th className="py-2 pr-0 font-medium text-right">Share</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.teamMember} className="border-b border-slate-100 last:border-0">
            <td className="py-2 pr-4 font-medium text-slate-800">
              {row.teamMember}
            </td>
            <td className="py-2 pr-4 text-right text-slate-700">{row.count}</td>
            <td className="py-2 pr-0 text-right">
              <span
                className={
                  row.pct >= 50
                    ? "text-red-600 font-semibold"
                    : row.pct >= 25
                    ? "text-amber-600 font-medium"
                    : "text-slate-700"
                }
              >
                {row.pct.toFixed(0)}%
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
