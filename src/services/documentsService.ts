import { supabase } from "./supabase";

// Creează document nou
export async function createDocument(
  title: string,
  category: string,
  fileUrl?: string,
) {
  const documentNumber = `REG-${Math.floor(100000 + Math.random() * 900000)}`;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("municipality_id")
    .eq("id", user?.id)
    .single();

  return supabase.from("documents").insert([
    {
      number: documentNumber,
      title,
      category,
      status: "registered",
      file_url: fileUrl || null,
      user_id: user?.id || null,
      municipality_id: profile?.municipality_id,
      created_at: new Date().toISOString(),
    },
  ]);
}

// Upload fișier
export async function uploadDocumentFile(file: File) {
  const fileExt = file.name.split(".").pop();

  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 7)}.${fileExt}`;

  const filePath = `acte/${fileName}`;

  const { error } = await supabase.storage
    .from("documente-primarie")
    .upload(filePath, file);

  if (error) {
    return { fileUrl: null, error };
  }

  const { data: publicUrlData } = supabase.storage
    .from("documente-primarie")
    .getPublicUrl(filePath);

  return {
    fileUrl: publicUrlData.publicUrl,
    error: null,
  };
}

// Încarcă doar documentele primăriei utilizatorului
export async function getDocuments() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("municipality_id")
    .eq("id", user?.id)
    .single();

  return supabase
    .from("documents")
    .select("*")
    .eq("municipality_id", profile?.municipality_id)
    .order("created_at", {
      ascending: false,
    });
}

// Schimbă status
export async function updateDocumentStatus(id: string, nextStatus: string) {
  return supabase
    .from("documents")
    .update({
      status: nextStatus,
    })
    .eq("id", id);
}

// Finalizare document
export async function finalizeDocumentWithResponse(
  id: string,
  responseUrl: string,
) {
  return supabase
    .from("documents")
    .update({
      status: "completed",
      response_file_url: responseUrl,
    })
    .eq("id", id);
}
