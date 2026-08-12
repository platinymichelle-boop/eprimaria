import { supabase } from "./supabase";
import { getCurrentMunicipalityId } from "./municipalityService";

export async function getEditions() {
  const municipalityId =
    await getCurrentMunicipalityId();

  return supabase
    .from("news_editions")
    .select("*")
    .eq("municipality_id", municipalityId)
    .order("year", {
      ascending: false,
    });
}

export async function createEdition(
  title: string,
  month: number,
  year: number
) {
  const municipalityId =
    await getCurrentMunicipalityId();

  return supabase
    .from("news_editions")
    .insert({
      title,
      month,
      year,
      municipality_id:
        municipalityId,
    });
}