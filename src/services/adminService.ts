import { supabase } from "./supabase";

export async function getUsers() {
  return supabase
    .from("profiles")
    .select("*")
    .order("created_at", {
      ascending: false,
    });
}

export async function updateUserRole(
  id: string,
  role: string
) {
  return supabase
    .from("profiles")
    .update({ role })
    .eq("id", id);
}
export async function getMunicipalityByUser(
  userId: string
) {
  return supabase
    .from("profiles")
    .select(`
      municipality_id,
      municipalities (
        id,
        name,
        county,
        city
      )
    `)
    .eq("id", userId)
    .single();
}