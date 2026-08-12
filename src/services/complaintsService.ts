import { supabase } from "./supabase";
import { getCurrentMunicipalityId } from "./municipalityService";

export async function createComplaint(
  title: string,
  description: string
) {
  const municipalityId =
    await getCurrentMunicipalityId();

  return supabase.from("complaints").insert({
    title,
    description,
    status: "new",
    municipality_id: municipalityId,
  });
}

export async function getComplaints() {
  const municipalityId =
    await getCurrentMunicipalityId();

  return supabase
    .from("complaints")
    .select("*")
    .eq("municipality_id", municipalityId)
    .order("created_at", {
      ascending: false,
    });
}

export async function updateComplaintStatus(
  id: string,
  status: string
) {
  return supabase
    .from("complaints")
    .update({ status })
    .eq("id", id)
    .select();
}

export async function getDashboardStats() {
  const municipalityId =
    await getCurrentMunicipalityId();

  const { data: complaints } = await supabase
    .from("complaints")
    .select("status")
    .eq("municipality_id", municipalityId);

  const newCount =
    complaints?.filter(
      (c) => c.status === "new"
    ).length || 0;

  const inProgressCount =
    complaints?.filter(
      (c) => c.status === "in_progress"
    ).length || 0;

  const resolvedCount =
    complaints?.filter(
      (c) => c.status === "resolved"
    ).length || 0;

  return {
    newCount,
    inProgressCount,
    resolvedCount,
  };
}

export async function getCitizensCount() {
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