import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";
import { supabase } from "../services/supabase";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Stări pentru datele Ziarului (Tabela newspaper_settings)
  const [newspaperName, setNewspaperName] = useState("");
  const [newspaperId, setNewspaperId] = useState<any>(null);

  // Stări pentru datele Primăriei (Tabela municipalities)
  const [municipalityName, setMunicipalityName] = useState("");
  const [county, setCounty] = useState("");
  const [municipalityId, setMunicipalityId] = useState<any>(null);

  // Stări pentru Opțiunile de Aplicație
  const [sendEmails, setSendEmails] = useState(true);
  const [notifyStatus, setNotifyStatus] = useState(true);

  useEffect(() => {
    loadAllSettings();
  }, []);

  async function loadAllSettings() {
    try {
      setLoading(true);

      const { data: newsData } = await supabase
        .from("newspaper_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (newsData) {
        setNewspaperName(newsData.newspaper_name || "");
        setNewspaperId(newsData.id);
      }

      const { data: muniData } = await supabase
        .from("municipalities")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (muniData) {
        setMunicipalityName(muniData.name || "");
        setCounty(muniData.county || "");
        setMunicipalityId(muniData.id);
      }
    } catch (error) {
      console.error("Eroare la încărcarea setărilor:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);

      if (newspaperId) {
        await supabase
          .from("newspaper_settings")
          .update({ newspaper_name: newspaperName })
          .eq("id", newspaperId);
      }

      if (municipalityId) {
        await supabase
          .from("municipalities")
          .update({
            name: municipalityName,
            county: county,
          })
          .eq("id", municipalityId);
      }

      alert(
        "Toate modificările au fost salvate cu succes! Reîmprospătează pagina pentru a vedea schimbările în Sidebar.",
      );
    } catch (error: any) {
      console.error("Eroare la salvare:", error);
      alert("Eroare la salvare: " + error.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
        maxWidth: "900px",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          mb: 1,
          fontFamily: "sans-serif",
        }}
      >
        Panou de Control & Setări Generale
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#64748b", mb: 4, fontFamily: "sans-serif" }}
      >
        Gestionează identitatea platformei tale, numele instituției publice și
        modulele active.
      </Typography>

      {/* SECȚIUNEA 1: IDENTITATE PLATFORMĂ */}
      <Paper
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          mb: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#0f172a",
            fontFamily: "sans-serif",
          }}
        >
          🏛️ Configurare Date Primărie
        </Typography>

        {/* PĂRINTE GRID */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Nume Primărie / Localitate"
              variant="outlined"
              fullWidth
              value={municipalityName}
              onChange={(e) => setMunicipalityName(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Județ"
              variant="outlined"
              fullWidth
              value={county}
              onChange={(e) => setCounty(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      {/* SECȚIUNEA 2: SETĂRI ZIAR */}
      <Paper
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          mb: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: "#0f172a",
            fontFamily: "sans-serif",
          }}
        >
          📰 Setări Publicație (Ziar Digital)
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Titlu Principal Ziar"
            variant="outlined"
            fullWidth
            value={newspaperName}
            onChange={(e) => setNewspaperName(e.target.value)}
          />
        </Box>
      </Paper>

      {/* SECȚIUNEA 3: CONFIGURĂRI SWITCH-URI */}
      <Paper
        sx={{
          p: 4,
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
          mb: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            color: "#0f172a",
            fontFamily: "sans-serif",
          }}
        >
          ⚙️ Modul Notificări și Automatizări
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={sendEmails}
                onChange={(e) => setSendEmails(e.target.checked)}
              />
            }
            label={
              <Typography sx={{ fontFamily: "sans-serif", fontSize: "14px" }}>
                Activează trimiterea de emailuri la sesizări noi
              </Typography>
            }
          />
          <Divider />
          <FormControlLabel
            control={
              <Switch
                checked={notifyStatus}
                onChange={(e) => setNotifyStatus(e.target.checked)}
              />
            }
            label={
              <Typography sx={{ fontFamily: "sans-serif", fontSize: "14px" }}>
                Notifică cetățenii pe telefon la schimbarea statusului
                documentelor
              </Typography>
            }
          />
        </Box>
      </Paper>

      {/* BUTON GLOBAL DE SALVARE */}
      <Button
        variant="contained"
        onClick={handleSave}
        disabled={saving}
        sx={{
          background: "#0f172a",
          color: "#fff",
          width: "100%",
          py: 2,
          borderRadius: "12px",
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: "16px",
          boxShadow: "0 4px 12px rgba(15, 23, 42, 0.15)",
          "&:hover": { background: "#1e293b" },
        }}
      >
        {saving
          ? "Se salvează modificările în baza de date..."
          : "SALVEAZĂ TOATE CONFIGURĂRILE"}
      </Button>
    </Box>
  );
}
