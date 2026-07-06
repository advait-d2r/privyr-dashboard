"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ShareEntry } from "@/lib/aggregate";
import { colorForIndex } from "@/lib/colors";
import { EmptyState } from "./CategoryBarChart";

const UNASSIGNED_COLOR = "#94a3b8"; // slate, distinct from the categorical palette

export function DonutChart({
  data,
  height = 220,
}: {
  data: ShareEntry[];
  height?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  if (total === 0) return <EmptyState message="No leads in this category" />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="teamMember"
          innerRadius="55%"
          outerRadius="85%"
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.teamMember}
              fill={
                entry.teamMember === "Unassigned"
                  ? UNASSIGNED_COLOR
                  : colorForIndex(i)
              }
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, item) => {
            const pct = (item?.payload as ShareEntry | undefined)?.pct ?? 0;
            return [`${value} leads (${pct.toFixed(0)}%)`, name];
          }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
