import { useState } from "react";

import { Box, Button, Card, CardContent, Typography } from "@mui/material";

import ComplaintForm from "../components/ComplaintForm";
import ComplaintsList from "../components/ComplaintsList";

export default function ComplaintsPage() {
  const [showForm, setShowForm] = useState(false);

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
        Sesizări
      </Typography>

      <Typography
        sx={{
          color: "#64748b",
          mb: 4,
        }}
      >
        Gestionarea sesizărilor cetățenilor.
      </Typography>

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Închide Formular" : "+ Adaugă Sesizare"}
        </Button>
      </Box>

      {showForm && (
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <ComplaintForm />
          </CardContent>
        </Card>
      )}

      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Lista Sesizări
          </Typography>

          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              backgroundColor: "#eff6ff",
              border: "1px solid #93c5fd",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#1e40af",
                fontWeight: 600,
              }}
            >
              ℹ️ MOD DEMO: Sesizările și imaginile utilizate în demonstrație
              sunt exemple de test și nu reprezintă situații reale raportate de
              cetățeni.
            </Typography>
          </Box>

          <ComplaintsList />
        </CardContent>
      </Card>
    </Box>
  );
}
