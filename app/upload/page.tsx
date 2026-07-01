"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; leadCount: number; activityCount: number }
  | { kind: "error"; message: string };

export default function UploadPage() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ kind: "error", message: data.error || "Upload failed." });
        return;
      }
      setStatus({
        kind: "success",
        leadCount: data.leadCount,
        activityCount: data.activityCount,
      });
    } catch {
      setStatus({ kind: "error", message: "Network error. Please try again." });
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Update Dashboard Data
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload today&apos;s Privyr exports. This replaces all existing data.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Client List Export (CSV)
            </label>
            <input
              type="file"
              name="clientList"
              accept=".csv"
              required
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-sm file:font-medium hover:file:bg-slate-700 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Timeline Activities Export (CSV)
            </label>
            <input
              type="file"
              name="timelineActivities"
              accept=".csv"
              required
              className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:text-sm file:font-medium hover:file:bg-slate-700 file:cursor-pointer cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="w-full rounded-lg bg-slate-900 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 transition"
          >
            {status.kind === "loading" ? "Uploading..." : "Replace Dashboard Data"}
          </button>
        </form>

        {status.kind === "success" && (
          <div className="mt-5 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-800">
            Uploaded successfully — {status.leadCount} leads and{" "}
            {status.activityCount} activities loaded.{" "}
            <Link href="/" className="font-medium underline">
              View dashboard
            </Link>
          </div>
        )}

        {status.kind === "error" && (
          <div className="mt-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
            {status.message}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-slate-400 hover:text-slate-600">
            &larr; Back to dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
