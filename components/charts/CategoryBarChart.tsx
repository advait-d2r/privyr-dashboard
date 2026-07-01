"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { colorForIndex } from "@/lib/colors";

export interface CategoryDatum {
  label: string;
  value: number;
}

export function CategoryBarChart({
  data,
  valueFormatter,
  colorFn,
  height,
}: {
  data: CategoryDatum[];
  valueFormatter?: (v: number) => string;
  colorFn?: (label: string, index: number) => string;
  height?: number;
}) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  const chartHeight = height ?? Math.max(120, data.length * 40);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 4 }}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={120}
          tick={{ fontSize: 12, fill: "#475569" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          formatter={(value) =>
            valueFormatter ? valueFormatter(Number(value)) : value
          }
          cursor={{ fill: "#f1f5f9" }}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
          {data.map((entry, i) => (
            <Cell
              key={entry.label}
              fill={colorFn ? colorFn(entry.label, i) : colorForIndex(i)}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function EmptyState({ message = "No data for this selection" }: { message?: string }) {
  return (
    <div className="h-24 flex items-center justify-center text-sm text-slate-400">
      {message}
    </div>
  );
}
