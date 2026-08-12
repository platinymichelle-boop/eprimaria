import { getCurrentUser } from "./authService";
import { supabase } from "./supabase";

export async function getCurrentUserRole() {
  const {
    data: { user },
  } = await getCurrentUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return data?.role ?? null;
}