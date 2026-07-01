"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatDateShort } from "@/lib/normalize";
import { EmptyState } from "./CategoryBarChart";

export interface TrendPoint {
  date: string;
  value: number | null;
}

export function TrendChart({
  data,
  color = "#6366f1",
  valueFormatter,
  height = 240,
}: {
  data: TrendPoint[];
  color?: string;
  valueFormatter?: (v: number) => string;
  height?: number;
}) {
  const hasData = data.some((d) => d.value !== null && d.value !== undefined);
  if (!hasData) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
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
          formatter={(value) =>
            valueFormatter ? valueFormatter(Number(value)) : value
          }
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          dot={data.length <= 14}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
