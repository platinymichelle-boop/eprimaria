import { supabase } from "./supabase";
import type { Citizen } from "../types/citizen";

import { getCurrentMunicipalityId } from "./municipalityService";

export async function getCitizens(): Promise<Citizen[]> {
  const municipalityId =
    await getCurrentMunicipalityId();

  const { data, error } = await supabase
    .from("citizens")
    .select("*")
    .eq("municipality_id", municipalityId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function createCitizen(
  citizen: Omit<Citizen, "id" | "created_at">
) {
  const municipalityId =
    await getCurrentMunicipalityId();

  const { error } = await supabase
    .from("citizens")
    .insert([
      {
        ...citizen,
        municipality_id: municipalityId,
      },
    ]);

  if (error) {
    console.error(error);
  }
}

export async function getCitizensCount(): Promise<number> {
  const municipalityId =
    await getCurrentMunicipalityId();

  const { count } = await supabase
    .from("citizens")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("municipality_id", municipalityId);

  return count || 0;
}

export async function deleteCitizen(id: string) {
  const { error } = await supabase
    .from("citizens")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
  }
}