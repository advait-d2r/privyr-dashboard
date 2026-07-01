export function fmtMins(v: number | null): string {
  if (v === null) return "—";
  if (v < 60) return `${v.toFixed(1)} min`;
  return `${(v / 60).toFixed(1)} hr`;
}

export function fmtPct(v: number | null): string {
  if (v === null) return "—";
  return `${v.toFixed(0)}%`;
}

export function fmtNumber(v: number): string {
  return v.toLocaleString("en-IN");
}
