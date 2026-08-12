import { Box, Card, CardContent, Typography } from "@mui/material";


import ComplaintForm from "../components/ComplaintForm";
import ComplaintsList from "../components/ComplaintsList";

export default function ComplaintsPage() {
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
          color: "#3c6394",
          mb: 4,
        }}
      >
        Gestionarea sesizărilor cetățenilor.
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Adaugă Sesizare
          </Typography>

          <ComplaintForm />
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Lista Sesizări
          </Typography>

          <ComplaintsList />
        </CardContent>
      </Card>
    </Box>
  );
}