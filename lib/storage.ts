import { promises as fs } from "fs";
import path from "path";
import { DashboardData } from "./types";

const BLOB_PATHNAME = "lead-dashboard/latest.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), ".data", "latest.json");

function hasBlobToken(): boolean {
  // @vercel/blob authenticates either via an explicit BLOB_READ_WRITE_TOKEN,
  // or via Vercel's OIDC token combined with BLOB_STORE_ID (the newer
  // "Connect Database" flow, which doesn't expose a read-write token at all).
  return !!(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function saveData(data: DashboardData): Promise<void> {
  const json = JSON.stringify(data);

  if (hasBlobToken()) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, json, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 0,
    });
    return;
  }

  await fs.mkdir(path.dirname(LOCAL_DATA_PATH), { recursive: true });
  await fs.writeFile(LOCAL_DATA_PATH, json, "utf-8");
}

export async function loadData(): Promise<DashboardData | null> {
  if (hasBlobToken()) {
    const { head } = await import("@vercel/blob");
    try {
      const blob = await head(BLOB_PATHNAME);
      const res = await fetch(blob.url, { cache: "no-store" });
      if (!res.ok) return null;
      return (await res.json()) as DashboardData;
    } catch {
      return null;
    }
  }

  try {
    const raw = await fs.readFile(LOCAL_DATA_PATH, "utf-8");
    return JSON.parse(raw) as DashboardData;
  } catch {
    return null;
  }
}
