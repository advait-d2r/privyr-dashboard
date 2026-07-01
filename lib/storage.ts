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
    // The blob store is provisioned as private-access-only, so the raw JSON
    // file isn't reachable via a guessable public URL — only this server
    // (via the SDK's authenticated `get`) can read it back.
    await put(BLOB_PATHNAME, json, {
      access: "private",
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
    const { get } = await import("@vercel/blob");
    try {
      const result = await get(BLOB_PATHNAME, { access: "private" });
      if (!result || result.statusCode !== 200) return null;
      const text = await new Response(result.stream).text();
      return JSON.parse(text) as DashboardData;
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
