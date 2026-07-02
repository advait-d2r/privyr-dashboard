"use client";

import { useMemo } from "react";
import { Lead } from "@/lib/types";
import {
  average,
  averageBy,
  avgByDateSeries,
  countBy,
  countByDateSeries,
  leadsByHourOfDay,
} from "@/lib/aggregate";
import { fmtMins, fmtNumber } from "@/lib/format";
import { colorForIndex } from "@/lib/colors";
import { Card } from "../Card";
import { KpiCard } from "../KpiCard";
import { CategoryBarChart } from "../charts/CategoryBarChart";
import { TrendChart } from "../charts/TrendChart";
import { HourOfDayChart, peakHourSummary } from "../charts/HourOfDayChart";

export function LeadOverviewSection({ leads }: { leads: Lead[] }) {
  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const uncontacted = leads.filter((l) => l.uncontacted).length;
    const unspecifiedStage = leads.filter(
      (l) => l.leadStage === "Unspecified"
    ).length;
    const avgFirstResponse = average(
      leads.map((l) => l.firstResponseMins).filter((v): v is number => v !== null)
    );

    const leadsByDate = countByDateSeries(leads.map((l) => l.dateCreated)).map(
      (d) => ({ date: d.date, value: d.count })
    );
    const leadsByHour = leadsByHourOfDay(leads.map((l) => l.dateCreated));
    const leadsBySource = countBy(leads, (l) => l.source).map((c) => ({
      label: c.key,
      value: c.count,
    }));
    const leadsByTeamMember = countBy(leads, (l) => l.teamMember).map((c) => ({
      label: c.key,
      value: c.count,
    }));
    const leadsByStage = countBy(leads, (l) => l.leadStage).map((c) => ({
      label: c.key,
      value: c.count,
    }));

    const avgResponseByDate = avgByDateSeries(
      leads.map((l) => ({ date: l.dateCreated, value: l.firstResponseMins }))
    ).map((d) => ({ date: d.date, value: d.avg }));
    const avgResponseByTeamMember = averageBy(
      leads,
      (l) => l.teamMember,
      (l) => l.firstResponseMins
    )
      .filter((a) => a.avg !== null)
      .map((a) => ({ label: a.key, value: a.avg as number }));
    const avgResponseBySource = averageBy(
      leads,
      (l) => l.source,
      (l) => l.firstResponseMins
    )
      .filter((a) => a.avg !== null)
      .map((a) => ({ label: a.key, value: a.avg as number }));
    const avgResponseByStage = averageBy(
      leads,
      (l) => l.leadStage,
      (l) => l.firstResponseMins
    )
      .filter((a) => a.avg !== null)
      .map((a) => ({ label: a.key, value: a.avg as number }));

    return {
      totalLeads,
      uncontacted,
      unspecifiedStage,
      avgFirstResponse,
      leadsByDate,
      leadsByHour,
      leadsBySource,
      leadsByTeamMember,
      leadsByStage,
      avgResponseByDate,
      avgResponseByTeamMember,
      avgResponseBySource,
      avgResponseByStage,
    };
  }, [leads]);

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        1. Lead Overview
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <KpiCard label="Total Leads" value={fmtNumber(stats.totalLeads)} />
        <KpiCard
          label="Uncontacted Leads"
          value={fmtNumber(stats.uncontacted)}
          accent="text-red-600"
          hint="Total Activities = 0"
        />
        <KpiCard
          label="Unspecified Stage"
          value={fmtNumber(stats.unspecifiedStage)}
          hint="Lead Stage blank or '-'"
        />
        <KpiCard
          label="Avg First Response"
          value={fmtMins(stats.avgFirstResponse)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Leads Created by Date" className="lg:col-span-2">
          <TrendChart data={stats.leadsByDate} />
        </Card>
        <Card
          title="Leads Created by Hour of Day"
          subtitle={peakHourSummary(stats.leadsByHour) ?? undefined}
          className="lg:col-span-2"
        >
          <HourOfDayChart data={stats.leadsByHour} />
        </Card>
        <Card title="Leads by Source">
          <CategoryBarChart data={stats.leadsBySource} />
        </Card>
        <Card title="Leads by Assigned Team Member">
          <CategoryBarChart
            data={stats.leadsByTeamMember}
            colorFn={(_, i) => colorForIndex(i)}
          />
        </Card>
        <Card title="Leads by Stage" className="lg:col-span-2">
          <CategoryBarChart data={stats.leadsByStage} />
        </Card>
      </div>

      <h3 className="text-sm font-semibold text-slate-700 mt-6 mb-3">
        First Response Time
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Average First Response by Date" className="lg:col-span-2">
          <TrendChart
            data={stats.avgResponseByDate}
            color="#f59e0b"
            valueFormatter={(v) => fmtMins(v)}
          />
        </Card>
        <Card title="Average First Response by Team Member">
          <CategoryBarChart
            data={stats.avgResponseByTeamMember}
            valueFormatter={(v) => fmtMins(v)}
          />
        </Card>
        <Card title="Average First Response by Source">
          <CategoryBarChart
            data={stats.avgResponseBySource}
            valueFormatter={(v) => fmtMins(v)}
          />
        </Card>
        <Card title="Average First Response by Lead Stage" className="lg:col-span-2">
          <CategoryBarChart
            data={stats.avgResponseByStage}
            valueFormatter={(v) => fmtMins(v)}
          />
        </Card>
      </div>
    </section>
  );
}
