import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import {
  Description,
  CheckCircle,
  AssignmentLate,
  People,
} from "@mui/icons-material";
import { supabase } from "../services/supabase";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetchLiveStats();
  }, []);

  async function fetchLiveStats() {
    try {
      setLoading(true);

      // 1. Numărăm sesizările rezolvate din tabela ta 'complaints'
      const { count: resolvedCount } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true })
        .eq("status", "rezolvat"); // NOTĂ: Dacă în DB ai scris "Rezolvat" sau "resolved", modifică textul aici ca să se potrivească exact

      // 2. Numărăm sesizările în curs (sau noi/nealocate) din tabela 'complaints'
      const { count: pendingCount } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true })
        .eq("status", "in_lucru"); // NOTĂ: Modifică cu statusul tău real (ex: "pending", "nou", etc.)

      // 3. Numărăm totalul general de sesizări din tabela 'complaints'
      const { count: totalComplaints } = await supabase
        .from("complaints")
        .select("*", { count: "exact", head: true });

      // 4. Numărăm totalul de cetățeni din tabela ta dedicată 'citizens'
      const { count: citizensCount } = await supabase
        .from("citizens")
        .select("*", { count: "exact", head: true });

      // Calculăm un procentaj simplu pentru bara de progres a sesizărilor rezolvate
      const total = totalComplaints || 1;
      const progressResolved = Math.round(((resolvedCount || 0) / total) * 100);
      const progressPending = Math.round(((pendingCount || 0) / total) * 100);

      setStats([
        {
          title: "Sesizări Rezolvate",
          count: resolvedCount || 0,
          icon: <CheckCircle color="success" />,
          progress: progressResolved,
          color: "#2e7d32",
        },
        {
          title: "Sesizări în Curs",
          count: pendingCount || 0,
          icon: <Description color="primary" />,
          progress: progressPending,
          color: "#1976d2",
        },
        {
          title: "Total Sesizări Primite",
          count: totalComplaints || 0,
          icon: <AssignmentLate color="error" />,
          progress: 100,
          color: "#d32f2f",
        },
        {
          title: "Cetățeni Înregistrați",
          count: citizensCount || 0,
          icon: <People color="action" />,
          progress: 100,
          color: "#475569",
        },
      ]);
    } catch (error) {
      console.error("Eroare la aducerea statisticilor:", error);
    } finally {
      setLoading(false);
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
    <Box sx={{ p: 4, backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#1e293b",
          mb: 1,
          fontFamily: "sans-serif",
        }}
      >
        Rapoarte și Statistici Live
      </Typography>
      <Typography
        variant="body2"
        sx={{ color: "#64748b", mb: 4, fontFamily: "sans-serif" }}
      >
        Date statistice calculate automat din tabelele primăriei.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          // CORECTAT: Am scos 'item' și proprietățile vechi, înlocuindu-le cu formatul nativ MUI v6
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                border: "1px solid #e2e8f0",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "#f1f5f9",
                    borderRadius: "12px",
                    display: "flex",
                  }}
                >
                  {stat.icon}
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "#0f172a",
                    fontFamily: "sans-serif",
                  }}
                >
                  {stat.count}
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: "#64748b",
                  mb: 2,
                  minHeight: "40px",
                  fontFamily: "sans-serif",
                }}
              >
                {stat.title}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stat.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#cbd5e1",
                  "& .MuiLinearProgress-bar": { backgroundColor: stat.color },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
