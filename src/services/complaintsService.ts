import { supabase } from "./supabase";
import { getCurrentMunicipalityId } from "./municipalityService";

export async function createComplaint(data: {
  title: string;
  description: string;
  category: string;
  priority: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
}) {
  const municipalityId = await getCurrentMunicipalityId();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase
    .from("complaints")
    .insert({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      address: data.address,
      status: "new",
      municipality_id: municipalityId,
      user_id: user?.id,
    })
    .select();
}

export async function getComplaints() {
  const municipalityId = await getCurrentMunicipalityId();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  console.log("USER:", user?.email);
  console.log("ROLE:", profile?.role);
  console.log("MUNICIPALITY:", municipalityId);

  // CETĂȚEAN
  if (profile?.role === "citizen") {
    console.log("CITIZEN FILTER");

    return supabase
      .from("complaints")
      .select(
        `
        *,
        complaint_photos (
          photo_url
        )
      `,
      )
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });
  }

  console.log("ADMIN FILTER");

  return supabase
    .from("complaints")
    .select(
      `
      *,
      complaint_photos (
        photo_url
      )
    `,
    )
    .eq("municipality_id", municipalityId)
    .order("created_at", { ascending: false });
}

export async function updateComplaintStatus(id: string, status: string) {
  const updateData: any = {
    status,
  };

  if (status === "resolved") {
    updateData.resolved_at = new Date().toISOString();
  }

  return supabase.from("complaints").update(updateData).eq("id", id).select();
}

export async function getDashboardStats() {
  const municipalityId = await getCurrentMunicipalityId();

  const { data: complaints } = await supabase
    .from("complaints")
    .select("status")
    .eq("municipality_id", municipalityId);

  const newCount = complaints?.filter((c) => c.status === "new").length || 0;

  const inProgressCount =
    complaints?.filter((c) => c.status === "in_progress").length || 0;

  const resolvedCount =
    complaints?.filter((c) => c.status === "resolved").length || 0;

  return {
    newCount,
    inProgressCount,
    resolvedCount,
  };
}

export async function getCitizensCount() {
  const municipalityId = await getCurrentMunicipalityId();

  const { count } = await supabase
    .from("citizens")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("municipality_id", municipalityId);

  return count || 0;
}
