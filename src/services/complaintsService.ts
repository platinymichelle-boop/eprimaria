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