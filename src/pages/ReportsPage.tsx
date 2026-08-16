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
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

interface StatCard {
  title: string;
  count: string | number;
  icon: React.ReactNode;
  progress: number;
  color: string;
}

interface ChartData {
  name?: string;
  value?: number;
  luna?: string;
  total?: number;
}

export default function ReportsPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<StatCard[]>([]);
  const [complaintsChart, setComplaintsChart] = useState<ChartData[]>([]);
  const [statusChart, setStatusChart] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchLiveStats();
  }, []);

  async function fetchLiveStats() {
    try {
      setLoading(true);

      const { data: complaints, error } = await supabase
        .from("complaints")
        .select("status, created_at");

      if (error) throw error;

      const { count: citizensCount } = await supabase
        .from("citizens")
        .select("*", { count: "exact", head: true });

      const total = complaints?.length || 0;

      const resolved =
        complaints?.filter((c) => c.status === "resolved").length || 0;

      const pending =
        complaints?.filter((c) => c.status === "in_progress").length || 0;

      const newComplaints =
        complaints?.filter((c) => c.status === "new").length || 0;

      const progressResolved =
        total > 0 ? Math.round((resolved / total) * 100) : 0;

      const progressPending =
        total > 0 ? Math.round((pending / total) * 100) : 0;

      const resolutionRate =
        total > 0 ? Math.round((resolved / total) * 100) : 0;

      setStats([
        {
          title: "Sesizări Rezolvate",
          count: resolved,
          icon: <CheckCircle color="success" />,
          progress: progressResolved,
          color: "#2e7d32",
        },
        {
          title: "Sesizări în Curs",
          count: pending,
          icon: <Description color="primary" />,
          progress: progressPending,
          color: "#1976d2",
        },
        {
          title: "Total Sesizări Primite",
          count: total,
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
        {
          title: "Rată Generală Rezolvare",
          count: `${resolutionRate}%`,
          icon: <CheckCircle color="success" />,
          progress: resolutionRate,
          color: "#22c55e",
        },
      ]);

      setStatusChart([
        {
          name: "Rezolvate",
          value: resolved,
        },
        {
          name: "În Lucru",
          value: pending,
        },
        {
          name: "Noi",
          value: newComplaints,
        },
      ]);

      const months = [
        "Ian",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Iun",
        "Iul",
        "Aug",
        "Sep",
        "Oct",
        "Noi",
        "Dec",
      ];

      const monthlyData = months.map((month) => ({
        luna: month,
        total: 0,
      }));

      complaints?.forEach((complaint) => {
        const date = new Date(complaint.created_at);
        const monthIndex = date.getMonth();

        if (monthlyData[monthIndex]) {
          monthlyData[monthIndex].total += 1;
        }
      });

      setComplaintsChart(monthlyData);
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

  const pieColors = ["#2e7d32", "#1976d2", "#f59e0b"];

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
        sx={{
          color: "#64748b",
          mb: 4,
          fontFamily: "sans-serif",
        }}
      >
        Date statistice calculate automat din tabelele primăriei.
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={index}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                border: "1px solid #e2e8f0",
                height: "100%",
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
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: stat.color,
                  },
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              border: "1px solid #e2e8f0",
              height: 450,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Evoluție Sesizări
            </Typography>

            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={complaintsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="luna" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#1976d2" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
              border: "1px solid #e2e8f0",
              height: 450,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 3,
              }}
            >
              Status Sesizări
            </Typography>

            <Box sx={{ width: "100%", height: 350 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChart}
                    dataKey="value"
                    outerRadius={100}
                    label
                  >
                    {statusChart.map((_, index) => (
                      <Cell
                        key={index}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
