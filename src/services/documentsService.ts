import { supabase } from "./supabase";

// 1. Creează un document nou și îl leagă de ID-ul cetățeanului logat
export async function createDocument(
  title: string,
  category: string,
  fileUrl?: string,
) {
  // Generăm un număr unic automat pentru registratură
  const documentNumber = `REG-${Math.floor(100000 + Math.random() * 900000)}`;

  // Preluăm informațiile despre utilizatorul curent din sesiunea Supabase
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return supabase.from("documents").insert([
    {
      number: documentNumber,
      title: title,
      category: category,
      status: "registered",
      file_url: fileUrl || null, // Se salvează link-ul dacă utilizatorul a încărcat ceva
      user_id: user?.id || null, // Adăugăm ID-ul unicat al cetățeanului logat
      created_at: new Date().toISOString(),
    },
  ]);
}

// 2. Încarcă fișierul fizic (PDF, Excel, Poze, CSV) în Supabase Storage (Bucket)
export async function uploadDocumentFile(file: File) {
  // Extragem extensia fișierului (.pdf, .xlsx, .png etc.)
  const fileExt = file.name.split(".").pop();
  // Generăm un nume unic unic bazat pe timp ca să nu se suprascrie documentele între ele
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
  const filePath = `acte/${fileName}`;

  // Uploadăm fișierul în bucket-ul numit 'documente-primarie'
  const { data, error } = await supabase.storage
    .from("documente-primarie")
    .upload(filePath, file);

  if (error) return { fileUrl: null, error };

  // Dacă încărcarea a reușit, preluăm link-ul public direct către el
  const { data: publicUrlData } = supabase.storage
    .from("documente-primarie")
    .getPublicUrl(filePath);

  return { fileUrl: publicUrlData.publicUrl, error: null };
}

// 3. Preia toate documentele ordonate cronologic (cele mai noi primele)
export async function getDocuments() {
  return supabase
    .from("documents")
    .select("*")
    .order("created_at", { ascending: false });
}

// 4. Actualizează statusul unui document pe parcursul fluxului administrativ
export async function updateDocumentStatus(id: string, nextStatus: string) {
  return supabase.from("documents").update({ status: nextStatus }).eq("id", id);
}
