"use client";

import { useMemo } from "react";
import { Activity } from "@/lib/types";
import { countBy, countByDateSeries, crossTab, stackedByDate } from "@/lib/aggregate";
import { fmtNumber } from "@/lib/format";
import { ACTIVITY_COLORS, colorForIndex } from "@/lib/colors";
import { Card } from "../Card";
import { KpiCard } from "../KpiCard";
import { CategoryBarChart } from "../charts/CategoryBarChart";
import { TrendChart } from "../charts/TrendChart";
import { StackedTrendChart } from "../charts/StackedTrendChart";
import { StackedCategoryChart } from "../charts/StackedCategoryChart";

const TYPE_ORDER = ["Phone Call", "Message", "Note", "Other"];

export function TeamProductivitySection({ activities }: { activities: Activity[] }) {
  const stats = useMemo(() => {
    const totalActivities = activities.length;

    const activitiesByDate = countByDateSeries(
      activities.map((a) => a.date)
    ).map((d) => ({ date: d.date, value: d.count }));

    const activitiesByTeamMember = countBy(activities, (a) => a.teamMember).map(
      (c) => ({ label: c.key, value: c.count })
    );

    const activitiesByType = TYPE_ORDER.map((type) => ({
      label: type,
      value: activities.filter((a) => a.type === type).length,
    })).filter((d) => d.value > 0);

    const byMemberAndDate = stackedByDate(
      activities,
      (a) => a.date,
      (a) => a.teamMember
    );

    const byMemberAndType = crossTab(
      activities,
      (a) => a.teamMember,
      (a) => a.type,
      TYPE_ORDER
    );

    return {
      totalActivities,
      activitiesByDate,
      activitiesByTeamMember,
      activitiesByType,
      byMemberAndDate,
      byMemberAndType,
    };
  }, [activities]);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        2. Team Productivity
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard
          label="Total Activities"
          value={fmtNumber(stats.totalActivities)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Activities by Date" className="lg:col-span-2">
          <TrendChart data={stats.activitiesByDate} color="#22c55e" />
        </Card>
        <Card title="Activities by Team Member">
          <CategoryBarChart
            data={stats.activitiesByTeamMember}
            colorFn={(_, i) => colorForIndex(i)}
          />
        </Card>
        <Card title="Activities by Type">
          <CategoryBarChart
            data={stats.activitiesByType}
            colorFn={(label) => ACTIVITY_COLORS[label] ?? "#94a3b8"}
          />
        </Card>
        <Card
          title="Activities by Team Member and Date"
          subtitle="Stacked by team member"
          className="lg:col-span-2"
        >
          <StackedTrendChart
            dates={stats.byMemberAndDate.dates}
            groups={stats.byMemberAndDate.groups}
            data={stats.byMemberAndDate.data}
            colorFn={(_, i) => colorForIndex(i)}
          />
        </Card>
        <Card
          title="Activities by Team Member and Type"
          subtitle="Calls, messages, notes, other — per person"
          className="lg:col-span-2"
        >
          <StackedCategoryChart
            rows={stats.byMemberAndType.rows}
            cols={stats.byMemberAndType.cols}
            data={stats.byMemberAndType.data}
            colorFn={(col) => ACTIVITY_COLORS[col] ?? "#94a3b8"}
          />
        </Card>
      </div>
    </section>
  );
}
