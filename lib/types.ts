export type ActivityCategory = "Phone Call" | "Message" | "Note" | "Other";

export interface Lead {
  dateCreated: string | null; // "YYYY-MM-DD HH:mm", naive (no timezone), or null if unparseable
  source: string;
  teamMember: string;
  leadStage: string;
  totalActivities: number;
  firstResponseMins: number | null;
  uncontacted: boolean;
}

export interface Activity {
  date: string | null; // "YYYY-MM-DD HH:mm", naive (no timezone)
  teamMember: string;
  type: ActivityCategory;
}

export interface DashboardData {
  uploadedAt: string;
  leads: Lead[];
  activities: Activity[];
}
