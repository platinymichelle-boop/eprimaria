import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";

import {
  Assignment,
  HourglassTop,
  CheckCircle,
  People,
} from "@mui/icons-material";

import {
  getDashboardStats,
  getCitizensCount,
} from "../services/complaintsService";

import {
  getCurrentMunicipality,
} from "../services/municipalitiesService";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    newCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
  });

  const [citizensCount, setCitizensCount] =
    useState(0);

  const [municipality, setMunicipality] =
    useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getDashboardStats();

    setStats(data);

    const citizens =
      await getCitizensCount();

    setCitizensCount(citizens);

    const municipalityData =
      await getCurrentMunicipality();

    setMunicipality(municipalityData);
  };

  const cards = [
    {
      title: "Sesizări Noi",
      value: stats.newCount,
      color: "#3b82f6",
      icon: <Assignment fontSize="large" />,
    },
    {
      title: "În Lucru",
      value: stats.inProgressCount,
      color: "#f59e0b",
      icon: <HourglassTop fontSize="large" />,
    },
    {
      title: "Rezolvate",
      value: stats.resolvedCount,
      color: "#22c55e",
      icon: <CheckCircle fontSize="large" />,
    },
    {
      title: "Cetățeni",
      value: citizensCount,
      color: "#8b5cf6",
      icon: <People fontSize="large" />,
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          minHeight: 260,

          backgroundImage: municipality?.image_url
            ? `url(${municipality.image_url})`
            : "linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)",

          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "rgba(15,23,42,0.70)",
          }}
        />

        <CardContent
          sx={{
            position: "relative",
            zIndex: 2,
            color: "white",
            p: 5,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            {municipality?.name ||
              "ePrimaria"}
          </Typography>

          <Typography
            variant="h5"
            sx={{
              mb: 2,
            }}
          >
            Platformă Digitală pentru
            Administrația Locală
          </Typography>

          <Typography
            sx={{
              fontSize: "16px",
              opacity: 0.9,
            }}
          >
            {municipality?.city &&
            municipality?.county
              ? `${municipality.city}, ${municipality.county}`
              : "Bun venit în platformă"}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            key={card.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >
            <Card
              sx={{
                height: "100%",
                borderLeft: `5px solid ${card.color}`,
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid
        container
        spacing={3}
        sx={{ mt: 1 }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Activitate Recentă
              </Typography>

              <Typography>
                • Modul activitate în dezvoltare
              </Typography>

              <Typography>
                • Jurnal acțiuni utilizatori
              </Typography>

              <Typography>
                • Modificări sesizări
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Informații Platformă
              </Typography>

              <Typography>
                Multi-Tenant: Activ
              </Typography>

              <Typography>
                Roluri: Activ
              </Typography>

              <Typography>
                Supabase: Conectat
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}