import { NextRequest, NextResponse } from "next/server";
import { parseClientListCsv, parseTimelineActivitiesCsv } from "@/lib/parseCsv";
import { saveData } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const password = String(formData.get("password") || "");
  const expected = process.env.UPLOAD_PASSWORD || "";
  if (!expected) {
    return NextResponse.json(
      { error: "Server is missing UPLOAD_PASSWORD configuration." },
      { status: 500 }
    );
  }
  if (password !== expected) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const clientListFile = formData.get("clientList") as File | null;
  const timelineFile = formData.get("timelineActivities") as File | null;

  if (!clientListFile || !timelineFile) {
    return NextResponse.json(
      { error: "Both CSV files are required." },
      { status: 400 }
    );
  }

  try {
    const [clientListText, timelineText] = await Promise.all([
      clientListFile.text(),
      timelineFile.text(),
    ]);

    const leads = parseClientListCsv(clientListText);
    const activities = parseTimelineActivitiesCsv(timelineText);

    if (leads.length === 0 || activities.length === 0) {
      return NextResponse.json(
        {
          error:
            "One of the files parsed to zero rows. Please check you selected the correct exports.",
        },
        { status: 400 }
      );
    }

    await saveData({
      uploadedAt: new Date().toISOString(),
      leads,
      activities,
    });

    return NextResponse.json({
      ok: true,
      leadCount: leads.length,
      activityCount: activities.length,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to parse or save the uploaded files." },
      { status: 500 }
    );
  }
}
