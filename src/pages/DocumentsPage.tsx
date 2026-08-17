import { supabase } from "../services/supabase"; // <--- AM ADĂUGAT ACEST IMPORT
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
  MenuItem,
  CircularProgress,
} from "@mui/material";

import {
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  NoteAdd as AddIcon,
  AttachFile as AttachIcon,
  Visibility as ViewIcon,
} from "@mui/icons-material";

import {
  createDocument,
  getDocuments,
  updateDocumentStatus,
  uploadDocumentFile,
} from "../services/documentsService";

// Categorii standard folosite în primării
const CATEGORII_PRIMARIE = [
  "CADASTRU",
  "URBANISM & AUTORIZAȚII",
  "TAXE ȘI IMPOZITE",
  "STARE CIVILĂ",
  "REGISTRU AGRICOL",
  "CERERI GENERALE",
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  // State-uri pentru fișierul atașat
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();

    // 1. Cerem permisiunea cetățeanului pentru a trimite notificări push pe ecran
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    // 2. Ne conectăm la canalul live din Supabase pentru a asculta modificările de status
    const channel = supabase
      .channel("alerte-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "documents",
        },
        (payload) => {
          const docModificat = payload.new;

          // Declanșăm o notificare Push nativă pe ecranul utilizatorului
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("ePrimăria Alerte", {
              body: `Cererea ta (${docModificat.number}) a fost trecută în stadiul: ${
                docModificat.status === "in_progress"
                  ? "În lucru 📝"
                  : "Finalizat ✅"
              }`,
            });
          }

          // Reîncărcăm automat tabelul pe ecran, fără ca utilizatorul să dea refresh manual!
          loadDocuments();
        },
      )
      .subscribe();

    // Închidem canalul de comunicare când utilizatorul părăsește pagina
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadDocuments() {
    const { data, error } = await getDocuments();
    if (error) {
      console.error(error);
      return;
    }
    setDocuments(data || []);
  }

  function renderStatusChip(status: string) {
    switch (status) {
      case "registered":
        return (
          <Chip label="Înregistrat" color="info" sx={{ fontWeight: 600 }} />
        );
      case "in_progress":
        return (
          <Chip
            label="În lucru"
            color="warning"
            sx={{ fontWeight: 600, color: "#fff" }}
          />
        );
      case "completed":
        return (
          <Chip label="Finalizat" color="success" sx={{ fontWeight: 600 }} />
        );
      default:
        return <Chip label={status} />;
    }
  }

  function getNextStatus(status: string) {
    switch (status) {
      case "registered":
        return "in_progress";
      case "in_progress":
        return "completed";
      default:
        return "completed";
    }
  }

  async function handleStatusChange(id: string, currentStatus: string) {
    const nextStatus = getNextStatus(currentStatus);
    const { error } = await updateDocumentStatus(id, nextStatus);

    if (error) {
      alert(error.message);
      return;
    }
    loadDocuments();
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title || !category) {
      alert("Te rugăm să completezi titlul și categoria!");
      return;
    }

    setUploading(true);
    let finalFileUrl = "";

    // Dacă utilizatorul a pus un fișier, îl trimitem mai întâi în Storage
    if (selectedFile) {
      const { fileUrl, error: uploadError } =
        await uploadDocumentFile(selectedFile);
      if (uploadError) {
        alert("Eroare la încărcarea fișierului: " + uploadError.message);
        setUploading(false);
        return;
      }
      if (fileUrl) finalFileUrl = fileUrl;
    }

    // Salvăm rândul în baza de date împreună cu link-ul fișierului
    const { error } = await createDocument(title, category, finalFileUrl);
    setUploading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setTitle("");
    setCategory("");
    setSelectedFile(null);
    loadDocuments();
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}
      >
        Documente / Registratură
      </Typography>

      {/* Formular Înregistrare */}
      <Card
        sx={{
          mb: 4,
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 700, color: "#334155" }}
          >
            Înregistrare Document Nou
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 7 }}>
                <TextField
                  fullWidth
                  label="Titlu / Descriere Document"
                  placeholder="Ex: Cerere autorizație de construire..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  fullWidth
                  select
                  label="Categorie"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORII_PRIMARIE.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Buton Selectare Fișier */}
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    variant="outlined"
                    component="label"
                    color="secondary"
                    startIcon={<AttachIcon />}
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderRadius: "8px",
                    }}
                  >
                    Alege fișier (PDF, Imagini, Excel, CSV)
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        }
                      }}
                    />
                  </Button>

                  {selectedFile && (
                    <Typography
                      variant="body2"
                      sx={{ color: "#059669", fontWeight: 600 }}
                    >
                      Fișier selectat: {selectedFile.name} (
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Button
                  type="submit"
                  disabled={uploading}
                  variant="contained"
                  startIcon={
                    uploading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AddIcon />
                    )
                  }
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: "10px",
                    fontWeight: "bold",
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1d4ed8" },
                  }}
                >
                  {uploading
                    ? "Se încarcă fișierul..."
                    : "Înregistrează în Registru"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      {/* Registru Documente sub formă de tabel */}
      <Card
        sx={{ borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 3, fontWeight: 700, color: "#334155" }}
          >
            Registru General Digital
          </Typography>

          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "12px",
              boxShadow: "none",
              border: "1px solid #e2e8f0",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#f1f5f9" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Număr
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Titlu Document
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Categorie
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Fișier Atașat
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                    Status Curent
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 700, color: "#475569" }}
                    align="center"
                  >
                    Acțiuni Flux
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {documents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 4, color: "#64748b" }}
                    >
                      Nu există documente înregistrate în acest moment.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => (
                    <TableRow
                      key={doc.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: "#2563eb" }}>
                        {doc.number}
                      </TableCell>

                      <TableCell sx={{ fontWeight: 500, color: "#1e293b" }}>
                        {doc.title.toUpperCase()}
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={doc.category}
                          variant="outlined"
                          size="small"
                          sx={{ borderColor: "#cbd5e1", color: "#475569" }}
                        />
                      </TableCell>

                      {/* Afișarea fișierului stocat */}
                      <TableCell>
                        {doc.file_url ? (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            startIcon={<ViewIcon />}
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                              textTransform: "none",
                              borderRadius: "6px",
                              fontWeight: 600,
                            }}
                          >
                            Vezi Act
                          </Button>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", fontStyle: "italic" }}
                          >
                            Fără fișier
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>{renderStatusChip(doc.status)}</TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "8px",
                            justifyContent: "center",
                          }}
                        >
                          {doc.status === "registered" && (
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              startIcon={<PlayIcon />}
                              onClick={() =>
                                handleStatusChange(doc.id, doc.status)
                              }
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "6px",
                              }}
                            >
                              Preia în lucru
                            </Button>
                          )}

                          {doc.status === "in_progress" && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              startIcon={<CheckIcon />}
                              onClick={() =>
                                handleStatusChange(doc.id, doc.status)
                              }
                              sx={{
                                textTransform: "none",
                                fontWeight: 600,
                                borderRadius: "6px",
                              }}
                            >
                              Finalizează
                            </Button>
                          )}

                          {doc.status === "completed" && (
                            <Chip
                              label="Fără acțiuni"
                              size="small"
                              variant="outlined"
                              sx={{ color: "#94a3b8", borderColor: "#e2e8f0" }}
                            />
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
