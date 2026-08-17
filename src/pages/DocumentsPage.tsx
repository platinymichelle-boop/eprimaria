import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../services/supabase";
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
  CloudDownload as DownloadIcon,
} from "@mui/icons-material";

import {
  createDocument,
  getDocuments,
  updateDocumentStatus,
  uploadDocumentFile,
  finalizeDocumentWithResponse,
} from "../services/documentsService";

import { getCurrentUserRole } from "../services/userService";

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
  const [userRole, setUserRole] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseFile, setResponseFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    loadDocuments();
    loadUserRole();

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }

    const channel = supabase
      .channel("alerte-status")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "documents" },
        (payload) => {
          const docModificat = payload.new;
          if (
            typeof window !== "undefined" &&
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("ePrimăria Alerte", {
              body: `Cererea ta (${docModificat.number}) are un status nou: ${
                docModificat.status === "in_progress"
                  ? "În lucru 📝"
                  : "Finalizat ✅"
              }`,
            });
          }
          loadDocuments();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadUserRole() {
    const role = await getCurrentUserRole();
    setUserRole(role || "citizen");
  }

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

  async function handleStartProgress(id: string) {
    const { error } = await updateDocumentStatus(id, "in_progress");
    if (error) alert(error.message);
    loadDocuments();
  }

  async function handleFinalizeWithFile(id: string) {
    if (!responseFile) {
      alert("Te rugăm să încarci documentul oficial de răspuns mai întâi!");
      return;
    }
    setUploading(true);
    const { fileUrl, error: uploadError } =
      await uploadDocumentFile(responseFile);

    if (uploadError) {
      alert("Eroare la încărcare: " + uploadError.message);
      setUploading(false);
      return;
    }

    if (fileUrl) {
      const { error } = await finalizeDocumentWithResponse(id, fileUrl);
      if (error) alert(error.message);
    }

    setUploading(false);
    setResponseFile(null);
    setActiveDocId(null);
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

    if (selectedFile) {
      const { fileUrl, error: uploadError } =
        await uploadDocumentFile(selectedFile);
      if (uploadError) {
        alert("Eroare: " + uploadError.message);
        setUploading(false);
        return;
      }
      if (fileUrl) finalFileUrl = fileUrl;
    }

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
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, mb: 3, color: "#1e293b" }}
        >
          Documente / Registratură
        </Typography>
      </motion.div>
      {/* 🔴 ADĂUGĂM CONDIȚIA AICI: Formularul se deschide doar dacă utilizatorul este cetățean */}
      {userRole === "citizen" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card
            sx={{
              mb: 4,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              overflow: "hidden",
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
                      placeholder="Ex: Cerere adeverință rol agricol..."
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
                        Alege fișier justificativ
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0)
                              setSelectedFile(e.target.files[0]); // <--- Am adăugat [0] la final
                          }}
                        />
                      </Button>
                      {selectedFile && (
                        <Typography
                          variant="body2"
                          sx={{ color: "#059669", fontWeight: 600 }}
                        >
                          📎 {selectedFile.name}
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
                      }}
                    >
                      {uploading ? "Se trimite..." : "Trimite către Primărie"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}{" "}
      {/* 🔴 ÎNCHIDEM CONDIȚIA AICI (chiar înainte de tabel) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card
          sx={{
            borderRadius: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, color: "#334155" }}
            >
              Dosarele Mele / Solicitări depuse
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
                      Descriere Solicitare
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                      Categorie
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                      Actul Tău
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                      Răspuns Oficial
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: "#475569" }}>
                      Status
                    </TableCell>
                    {(userRole === "super-admin" ||
                      userRole === "employee") && (
                      <TableCell
                        sx={{ fontWeight: 700, color: "#475569" }}
                        align="center"
                      >
                        Panou Funcționar
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>

                <TableBody>
                  <AnimatePresence>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          align="center"
                          sx={{ py: 4, color: "#64748b" }}
                        >
                          Nu ai depus niciun document până în prezent.
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((doc, index) => (
                        <TableRow
                          key={doc.id}
                          component={motion.tr}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          hover
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 700, color: "#2563eb" }}>
                            {doc.number}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: "#1e293b" }}>
                            {doc.title.toUpperCase()}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={doc.category}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>

                          <TableCell>
                            {doc.file_url ? (
                              <Button
                                variant="text"
                                size="small"
                                startIcon={<ViewIcon />}
                                href={doc.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Vezi Cerere
                              </Button>
                            ) : (
                              <Typography
                                variant="caption"
                                sx={{ color: "#94a3b8" }}
                              >
                                Niciun fișier
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            {doc.response_file_url ? (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                startIcon={<DownloadIcon />}
                                href={doc.response_file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  textTransform: "none",
                                  fontWeight: "bold",
                                  borderRadius: "6px",
                                  boxShadow: "0 2px 6px rgba(34,197,94,0.3)",
                                }}
                              >
                                Descarcă Act
                              </Button>
                            ) : (
                              <Typography
                                variant="caption"
                                sx={{ color: "#94a3b8", fontStyle: "italic" }}
                              >
                                În așteptare răspuns...
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>{renderStatusChip(doc.status)}</TableCell>

                          {(userRole === "super-admin" ||
                            userRole === "employee") && (
                            <TableCell align="center">
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "6px",
                                  alignItems: "center",
                                }}
                              >
                                {doc.status === "registered" && (
                                  <Button
                                    variant="contained"
                                    color="warning"
                                    size="small"
                                    startIcon={<PlayIcon />}
                                    onClick={() => handleStartProgress(doc.id)}
                                    sx={{
                                      textTransform: "none",
                                      fontWeight: 600,
                                    }}
                                  >
                                    Preia în lucru
                                  </Button>
                                )}

                                {doc.status === "in_progress" &&
                                  activeDocId !== doc.id && (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      startIcon={<CheckIcon />}
                                      onClick={() => setActiveDocId(doc.id)}
                                      sx={{
                                        textTransform: "none",
                                        fontWeight: 600,
                                      }}
                                    >
                                      Finalizează Solicitarea
                                    </Button>
                                  )}

                                {activeDocId === doc.id && (
                                  <Box
                                    sx={{
                                      p: 1,
                                      border: "1px dashed #2563eb",
                                      borderRadius: "8px",
                                      backgroundColor: "#eff6ff",
                                      width: "100%",
                                      maxWidth: "200px",
                                    }}
                                  >
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      component="label"
                                      startIcon={<AttachIcon />}
                                      sx={{
                                        textTransform: "none",
                                        mb: 1,
                                        width: "100%",
                                      }}
                                    >
                                      Pune Răspuns PDF
                                      <input
                                        type="file"
                                        hidden
                                        accept=".pdf,.jpg,.png"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files)
                                            setResponseFile(e.target.files[0]);
                                        }}
                                      />
                                    </Button>
                                    {responseFile && (
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          display: "block",
                                          color: "green",
                                          mb: 1,
                                        }}
                                      >
                                        {responseFile.name}
                                      </Typography>
                                    )}
                                    <Button
                                      variant="contained"
                                      color="success"
                                      size="small"
                                      onClick={() =>
                                        handleFinalizeWithFile(doc.id)
                                      }
                                      sx={{
                                        textTransform: "none",
                                        width: "100%",
                                      }}
                                    >
                                      Trimite la Cetățean
                                    </Button>
                                  </Box>
                                )}

                                {doc.status === "completed" && (
                                  <Chip
                                    label="Dosar Închis"
                                    size="small"
                                    variant="outlined"
                                    sx={{ color: "#94a3b8" }}
                                  />
                                )}
                              </Box>
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    )}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
