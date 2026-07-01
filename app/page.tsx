import Link from "next/link";
import { loadData } from "@/lib/storage";
import { DashboardClient } from "@/components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await loadData();

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            No data uploaded yet
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload today&apos;s Client List and Timeline Activities exports to
            see the dashboard.
          </p>
          <Link
            href="/upload"
            className="mt-5 inline-block rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2.5 hover:bg-slate-700 transition"
          >
            Upload Data
          </Link>
        </div>
      </main>
    );
  }

  return <DashboardClient data={data} />;
}
