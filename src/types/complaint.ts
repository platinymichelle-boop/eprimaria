export interface Complaint {
  id: string;
  title: string;
  description: string;
  status: "new" | "in_progress" | "resolved";
  created_at: string;
}