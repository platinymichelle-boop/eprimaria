import { supabase } from "./supabase";

export async function createComplaint(
  title: string,
  description: string
) {
  return supabase.from("complaints").insert({
    title,
    description,
    status: "new",
  });
}
export async function getComplaints() {
  return supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });
}
export async function getDashboardStats() {
  const { data: complaints } = await supabase
    .from("complaints")
    .select("status");

  const newCount =
    complaints?.filter((c) => c.status === "new").length || 0;

  const inProgressCount =
    complaints?.filter((c) => c.status === "in_progress").length || 0;

  const resolvedCount =
    complaints?.filter((c) => c.status === "resolved").length || 0;

  return {
    newCount,
    inProgressCount,
    resolvedCount,
  };
}
export async function getCitizensCount() {
  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  return count || 0;
}