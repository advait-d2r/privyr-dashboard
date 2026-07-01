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
import { EmptyState } from "./CategoryBarChart";

export function StackedCategoryChart({
  rows,
  cols,
  data,
  colorFn,
  height = 260,
}: {
  rows: string[];
  cols: string[];
  data: Record<string, number | string>[];
  colorFn: (col: string, index: number) => string;
  height?: number;
}) {
  if (rows.length === 0 || cols.length === 0) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="row"
          tick={{ fontSize: 12, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {cols.map((col, i) => (
          <Bar
            key={col}
            dataKey={col}
            stackId="stack"
            fill={colorFn(col, i)}
            radius={i === cols.length - 1 ? [4, 4, 0, 0] : undefined}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
