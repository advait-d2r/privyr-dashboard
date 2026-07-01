export const PALETTE = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#84cc16", // lime
  "#0ea5e9", // sky
  "#f97316", // orange
];

export function colorForIndex(i: number): string {
  return PALETTE[i % PALETTE.length];
}

export const ACTIVITY_COLORS: Record<string, string> = {
  "Phone Call": "#6366f1",
  Message: "#22c55e",
  Note: "#f59e0b",
  Other: "#94a3b8",
};
