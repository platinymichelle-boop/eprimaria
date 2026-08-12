import { supabase } from "./supabase";

export async function getMunicipalities() {
  return supabase
    .from("municipalities")
    .select("*")
    .order("name");
}

export async function createMunicipality(
  name: string,
  county: string,
  city: string
) {
  return supabase
    .from("municipalities")
    .insert({
      name,
      county,
      city,
    });
}

export async function deleteMunicipality(
  id: string
) {
  return supabase
    .from("municipalities")
    .delete()
    .eq("id", id);
}
export async function getCurrentMunicipality() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("municipality_id")
    .eq("id", user.id)
    .single();

  if (!profile?.municipality_id) {
    return null;
  }

  const { data } = await supabase
    .from("municipalities")
    .select("*")
    .eq("id", profile.municipality_id)
    .single();

  return data;
}