"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateShort } from "@/lib/normalize";
import { EmptyState } from "./CategoryBarChart";

export function StackedTrendChart({
  dates,
  groups,
  data,
  colorFn,
  height = 260,
}: {
  dates: string[];
  groups: string[];
  data: Record<string, number | string>[];
  colorFn: (group: string, index: number) => string;
  height?: number;
}) {
  if (dates.length === 0 || groups.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatDateShort}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          labelFormatter={(label) => formatDateShort(String(label))}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {groups.map((group, i) => (
          <Bar
            key={group}
            dataKey={group}
            stackId="stack"
            fill={colorFn(group, i)}
            radius={i === groups.length - 1 ? [4, 4, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
