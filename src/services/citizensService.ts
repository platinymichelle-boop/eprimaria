import { supabase } from "./supabase";
import type { Citizen } from "../types/citizen";

export async function getCitizens(): Promise<Citizen[]> {
  const { data, error } = await supabase
    .from("citizens")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export async function createCitizen(
  citizen: Omit<Citizen, "id" | "created_at">
) {
  const { error } = await supabase
    .from("citizens")
    .insert([citizen]);

  if (error) {
    console.error(error);
  }
}

export async function getCitizensCount(): Promise<number> {
  const { count } = await supabase
    .from("citizens")
    .select("*", { count: "exact", head: true });

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
