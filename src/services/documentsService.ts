import { supabase } from "./supabase";
import { getCurrentMunicipalityId } from "./municipalityService";

export async function getDocuments() {
  const municipalityId =
    await getCurrentMunicipalityId();

  return supabase
    .from("documents")
    .select("*")
    .eq("municipality_id", municipalityId)
    .order("created_at", {
      ascending: false,
    });
}

export async function createDocument(
  title: string,
  category: string
) {
  const municipalityId =
    await getCurrentMunicipalityId();

  const { count } = await supabase
    .from("documents")
    .select("*", {
      count: "exact",
      head: true,
    });

  const documentNumber =
    `REG-${String(
      (count || 0) + 1
    ).padStart(6, "0")}`;

  return supabase
    .from("documents")
    .insert({
      number: documentNumber,
      title,
      category,
      municipality_id:
        municipalityId,
    });
}
export async function updateDocumentStatus(
  id: string,
  status: string
) {
  return supabase
    .from("documents")
    .update({ status })
    .eq("id", id);
}