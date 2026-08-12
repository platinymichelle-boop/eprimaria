import { supabase } from "./supabase";

export async function getCurrentMunicipalityId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("municipality_id")
    .eq("id", user.id)
    .single();

  return data?.municipality_id ?? null;
}