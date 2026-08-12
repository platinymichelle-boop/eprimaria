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

export default function DashboardPage() {
  const [stats, setStats] = useState({
    newCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
  });

  const [citizensCount, setCitizensCount] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const data = await getDashboardStats();
    setStats(data);

    const citizens = await getCitizensCount();
    setCitizensCount(citizens);
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
      <Typography
        variant="h4"
        sx={{
          color: "#0f172a",
          fontWeight: 700,
          mb: 1,
        }}
      >
        ePrimaria Dashboard
      </Typography>

      <Typography
        sx={{
          color: "#3568a5",
          mb: 4,
        }}
      >
        Platformă digitală pentru administrația publică locală
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            key={card.title}
            size={{ xs: 12, sm: 6, lg: 3 }}
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
                    justifyContent: "space-between",
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
    </Box>
  );
}