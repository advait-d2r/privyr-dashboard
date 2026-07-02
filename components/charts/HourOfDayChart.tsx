"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { HourCount } from "@/lib/aggregate";
import { formatHourLabel, formatHourShort } from "@/lib/normalize";
import { EmptyState } from "./CategoryBarChart";

const NORMAL_COLOR = "#c7d2fe"; // light indigo
const PEAK_COLOR = "#f59e0b"; // amber

export function HourOfDayChart({
  data,
  height = 260,
}: {
  data: HourCount[];
  height?: number;
}) {
  const maxCount = Math.max(0, ...data.map((d) => d.count));
  const hasData = maxCount > 0;

  if (!hasData) return <EmptyState />;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
        <CartesianGrid stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="hour"
          tickFormatter={(hour) => formatHourShort(Number(hour))}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          interval={1}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          labelFormatter={(hour) => formatHourLabel(Number(hour))}
          formatter={(value) => [`${value} leads`, ""]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e2e8f0",
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell
              key={entry.hour}
              fill={entry.count === maxCount ? PEAK_COLOR : NORMAL_COLOR}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** Returns a human label for the peak hour(s), e.g. "6 PM (42 leads)" or "6 PM, 7 PM (30 leads each)". */
export function peakHourSummary(data: HourCount[]): string | null {
  const maxCount = Math.max(0, ...data.map((d) => d.count));
  if (maxCount === 0) return null;
  const peakHours = data.filter((d) => d.count === maxCount).map((d) => d.hour);
  const labels = peakHours.map(formatHourLabel).join(", ");
  return peakHours.length === 1
    ? `Peak: ${labels} (${maxCount} leads)`
    : `Peak: ${labels} (${maxCount} leads each)`;
}
