export type UserRole = "citizen" | "operator" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at?: string;
}