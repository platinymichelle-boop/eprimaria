export interface Complaint {
  id: string;

  title: string;
  description: string;

  category: string | null;
  priority: string | null;
  address: string | null;

  status:
    | "new"
    | "in_progress"
    | "resolved";

  municipality_id: string | null;

  created_at: string;
  resolved_at: string | null;
}